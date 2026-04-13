"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, CheckCircle, ChevronDown, ChevronUp, Route as RouteIcon } from 'lucide-react';
import api, { ApiClientError, ApiEnvelope } from '@/lib/axios';
import { useCVContext } from '@/context/CVContext';

interface CVData {
  id: string;
  fileName: string;
  fileUrl: string;
  review: string;
}

export default function DashboardCvPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<CVData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReviewExpanded, setIsReviewExpanded] = useState(true);

  const { addCv, recentCvs, switchCv } = useCVContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setError('Please choose a PDF file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post<ApiEnvelope<CVData>>('/cv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Save CV to context (max 2 stored in localStorage)
      addCv(response.data.data);
      setResult(response.data.data);
    } catch (err) {
      setResult(null);
      setError(err instanceof ApiClientError ? err.message : 'CV upload failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!result) {
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      const downloadUrl = result.fileUrl.startsWith('/api/')
        ? result.fileUrl.replace('/api', '')
        : result.fileUrl;

      const response = await api.get<Blob>(downloadUrl, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to download the uploaded CV.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="space-y-12">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-notion font-bold">Curator / CV</p>
        <h1 className="text-5xl font-display font-extrabold tracking-tight text-foreground">CV Upload</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-notion font-medium">
          Upload your latest resume to trigger CV analysis, skill extraction, roadmap generation, and job matching from the rest of the dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border-notion bg-surface-medium p-8 shadow-2xl transition-all hover:bg-surface-medium/80">
        <div className="rounded-2xl border border-border-notion/60 bg-surface-high p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-notion mb-2">Upload Notes</p>
          <ul className="space-y-2 text-sm text-muted-notion font-medium leading-relaxed">
            <li>Use a readable PDF resume.</li>
            <li>The backend will extract text, call the AI analysis flow, and store the result for later matching.</li>
            <li>After upload, continue to Job Matches or Roadmap to verify the rest of the system.</li>
          </ul>
        </div>

        <div className="relative group">
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted-notion file:mr-6 file:rounded-xl file:border-0 file:bg-foreground file:px-6 file:py-3 file:text-sm file:font-bold file:text-background hover:file:opacity-90 file:transition-all cursor-pointer"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 bg-foreground text-background rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-40 active:scale-95 flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Processing...' : 'Upload & Analyze CV'}
        </button>
      </form>

      {error && (
        <div className="rounded-2xl border border-red-900/30 bg-red-950/20 p-5 text-sm text-red-400 font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-8 rounded-2xl border border-border-notion bg-surface-medium p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between border-b border-border-notion pb-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-notion mb-1 font-bold">Analyzed File</p>
              <h2 className="text-xl font-display font-bold text-foreground">{result.fileName}</h2>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-2 rounded-lg border border-border-notion text-sm font-bold text-foreground hover:bg-surface-high transition-all disabled:opacity-40"
            >
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="mt-0.5 text-primary" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-foreground">CV analysis completed.</p>
                <p className="text-sm text-muted-notion font-medium leading-relaxed">
                  Your upload is stored successfully. Use the actions below to verify roadmap generation and job matching from the same analyzed CV.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsReviewExpanded(!isReviewExpanded)}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">AI Review & Career Critique</p>
                <div className="h-px w-8 bg-primary/30 group-hover:w-12 transition-all"></div>
              </div>
              {isReviewExpanded ? <ChevronUp size={18} className="text-muted-notion" /> : <ChevronDown size={18} className="text-muted-notion" />}
            </button>

            {isReviewExpanded && (
              <div className="p-8 rounded-2xl bg-surface-high border border-border-notion/50 shadow-inner animate-in fade-in zoom-in-95 duration-300">
                <p className="text-base leading-8 text-foreground/90 font-medium whitespace-pre-wrap">
                  {result.review || 'Analysis completed. The system extracted core skills and generated a baseline review for the next steps in the dashboard.'}
                </p>
              </div>
            )}

            <div className="grid gap-4 pt-4 md:grid-cols-2">
              <Link
                href="/dashboard/roadmap"
                className="flex items-center justify-between rounded-2xl border border-border-notion bg-surface-high px-5 py-4 text-sm font-bold text-foreground transition-all hover:border-primary/30 hover:bg-surface-medium"
              >
                <span className="flex items-center gap-3">
                  <RouteIcon size={18} className="text-primary" />
                  View Strategic Roadmap
                </span>
                <span className="text-primary">Open</span>
              </Link>
              <Link
                href="/dashboard/jobs"
                className="flex items-center justify-between rounded-2xl border border-border-notion bg-surface-high px-5 py-4 text-sm font-bold text-foreground transition-all hover:border-primary/30 hover:bg-surface-medium"
              >
                <span className="flex items-center gap-3">
                  <Briefcase size={18} className="text-primary" />
                  Check Job Matches
                </span>
                <span className="text-primary">Open</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent CVs Section */}
      {recentCvs.length > 0 && (
        <div className="space-y-6 rounded-2xl border border-border-notion bg-surface-medium p-8 shadow-2xl">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-notion font-bold">Recent CVs</p>
            <h2 className="text-2xl font-display font-bold text-foreground">Last {recentCvs.length} Uploads</h2>
          </div>

          <div className="space-y-3">
            {recentCvs.map((cv) => (
              <div
                key={cv.id}
                className="flex items-center justify-between rounded-xl border border-border-notion/50 bg-surface-high p-4 hover:border-border-notion transition-all cursor-pointer"
                onClick={() => {
                  switchCv(cv.id);
                  setResult(cv);
                  setIsReviewExpanded(true);
                }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground truncate">{cv.fileName}</p>
                  <p className="text-xs text-muted-notion mt-1">
                    {cv.review.substring(0, 80)}...
                  </p>
                </div>
                <button className="ml-4 px-4 py-2 rounded-lg text-xs font-bold text-primary hover:bg-surface-medium transition-all">
                  Switch
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
