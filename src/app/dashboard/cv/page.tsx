"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, FileText, CheckCircle } from 'lucide-react';
import api, { ApiClientError, ApiEnvelope } from '@/lib/axios';

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setError('Hay chon mot file PDF.');
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
      setResult(response.data.data);
      // Optional: Redirect or notify to check roadmap
    } catch (err) {
      setResult(null);
      setError(err instanceof ApiClientError ? err.message : 'Upload CV thất bại.');
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
      const response = await api.get<Blob>(result.fileUrl, {
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
      setError(err instanceof ApiClientError ? err.message : 'Download CV that bai.');
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
          Upload your professional resume to begin the AI curation process. We extraction skills, experience, and potential growth paths.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border-notion bg-surface-medium p-8 shadow-2xl transition-all hover:bg-surface-medium/80">
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
          <div className="space-y-4">
            <button 
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
                  {result.review || "Phân tích hoàn tất. Hệ thống đã trích xuất các kỹ năng trọng yếu và xây dựng lộ trình sự nghiệp tương ứng. Vui lòng kiểm tra mục 'Curate Roadmap' để xem chi tiết."}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4">
               <Link href="/dashboard/roadmap" className="text-sm font-bold text-primary flex items-center gap-2 hover:gap-3 transition-all">
                  Next Step: View Strategic Roadmap →
               </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

