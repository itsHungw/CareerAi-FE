"use client";

import React, { useState } from 'react';
import api, { ApiClientError, ApiEnvelope } from '@/lib/axios';

interface CVData {
  id: string;
  fileName: string;
  fileUrl: string;
  parsedContent: string;
}

export default function DashboardCvPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<CVData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
    } catch (err) {
      setResult(null);
      setError(err instanceof ApiClientError ? err.message : 'Upload CV that bai.');
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
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-notion">CV</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">CV Upload</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-notion">
          Tai len file PDF de kiem tra luong upload, luu tru va link download da duoc sua.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border-notion bg-white p-6 dark:bg-zinc-900">
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-medium file:text-background"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60"
        >
          {isSubmitting ? 'Dang upload...' : 'Upload CV'}
        </button>
      </form>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4 rounded-2xl border border-border-notion bg-white p-6 dark:bg-zinc-900">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{result.fileName}</h2>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="mt-2 inline-block text-sm font-medium text-accent-notion hover:underline disabled:opacity-60"
            >
              {isDownloading ? 'Dang tai file...' : 'Download file'}
            </button>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-notion">Parsed Content</p>
            <p className="text-sm leading-6 text-foreground">{result.parsedContent}</p>
          </div>
        </div>
      )}
    </section>
  );
}
