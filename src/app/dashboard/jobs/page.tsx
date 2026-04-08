"use client";

import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  ExternalLink,
  Zap,
} from 'lucide-react';

import api, { ApiClientError, ApiEnvelope } from '@/lib/axios';

interface JobRequirement {
  id: string;
  isMandatory: boolean;
  preferredYearsOfExperience: number;
  skill: {
    name: string;
  };
}

interface JobMatch {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    descriptionHtml: string;
    sourceUrl: string;
  };
  matchPercentage: number;
  requirements: JobRequirement[];
}

export default function DashboardJobsPage() {
  const [jobs, setJobs] = React.useState<JobMatch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get<ApiEnvelope<JobMatch[]>>('/jobs/matches');
        setJobs(response.data.data);
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    void fetchMatches();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Curation / Opportunities</p>
        <h1 className="text-5xl font-display font-extrabold tracking-tight text-foreground">Precision Matches</h1>
        <p className="max-w-2xl text-lg text-muted-notion font-medium leading-relaxed">
          Opportunities identified through cross-referencing your analyzed skills with current market demands.
        </p>
      </header>

      {loading && (
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-[2rem] bg-surface-medium animate-pulse border border-border-notion"></div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-500 text-center font-bold">
          {error}
          <p className="text-sm font-medium mt-2 opacity-70">Upload a CV first if you have not created an analyzed profile yet.</p>
          <div className="mt-5">
            <Link
              href="/dashboard/cv"
              className="inline-flex rounded-xl border border-red-500/20 px-4 py-2 text-sm font-bold text-red-400 transition-all hover:bg-red-500/10"
            >
              Go to CV Upload
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="p-12 rounded-[2rem] bg-surface-medium border border-border-notion text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-surface-high flex items-center justify-center">
            <Zap size={32} className="text-muted-notion" />
          </div>
          <p className="text-xl font-bold text-foreground">No matches found yet.</p>
          <p className="text-muted-notion max-w-sm">Continue refining your profile or uploading more context for our AI to scan.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-6">
          {jobs.map((item) => (
            <div key={item.job.id} className="group relative p-8 rounded-[2rem] bg-surface-medium border border-border-notion hover:bg-surface-high transition-all duration-300 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] group-hover:bg-primary/10 transition-colors"></div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-high border border-border-notion flex items-center justify-center">
                      <Briefcase size={20} className="text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-foreground tracking-tight">{item.job.title}</h3>
                      <p className="text-sm font-bold text-primary uppercase tracking-widest">{item.job.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-notion font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {item.job.location || 'Remote'}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.requirements.map((req) => (
                      <span key={req.id} className={`text-[10px] font-bold px-2 py-1 rounded-md border ${req.isMandatory ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface-high border-border-notion/50 text-muted-notion'}`}>
                        {req.skill.name} {req.preferredYearsOfExperience > 0 ? `(${req.preferredYearsOfExperience}y)` : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <Zap size={14} className="text-primary" />
                      <span className="text-2xl font-display font-bold text-foreground">{item.matchPercentage.toFixed(0)}%</span>
                    </div>
                    <p className="text-[10px] font-bold text-muted-notion uppercase tracking-widest">Match Score</p>
                  </div>

                  <a href={item.job.sourceUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-foreground text-background text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg">
                    View Details
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
