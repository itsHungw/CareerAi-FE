"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  ExternalLink,
  Zap,
  Search,
  Filter,
  BarChart
} from 'lucide-react';

import api, { ApiClientError, ApiEnvelope } from '@/lib/axios';

interface MatchedJobResponse {
  jobId: string;
  title: string;
  company: string;
  location: string;
  role: string;
  level: string;
  salaryRange: string;
  sourceUrl: string;
  matchScore: number;
  chunkMatches: number;
}

export default function DashboardJobsPage() {
  const [jobs, setJobs] = useState<MatchedJobResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Filters state
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [location, setLocation] = useState('');

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const response = await api.post<ApiEnvelope<MatchedJobResponse[]>>('/jobs/match', {
        role: role.trim() || null,
        level: level.trim() || null,
        location: location.trim() || null
      });
      setJobs(response.data.data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  // Option lists for demo purposes
  const roles = ["Frontend", "Backend", "Fullstack", "DevOps", "AI", "Mobile", "Data"];
  const levels = ["Fresher", "Junior", "Middle", "Senior", "Lead", "Manager"];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">AI Career Copilot / Vector Search</p>
        <h1 className="text-5xl font-display font-extrabold tracking-tight text-foreground">Semantic Tech Matches</h1>
        <p className="max-w-2xl text-lg text-muted-notion font-medium leading-relaxed">
          Discover opportunities that deeply align with your CV based on semantic matching instead of simple keyword search.
        </p>
      </header>

      {/* Filter Bar */}
      <div className="p-6 md:p-8 rounded-[2xl] bg-surface-medium border border-border-notion flex flex-col md:flex-row gap-4 md:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-bold text-foreground flex items-center gap-2"><Filter size={14}/> Target Role</label>
          <select 
            className="w-full h-12 px-4 rounded-xl shadow-inner border border-border-notion bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Any Role</option>
            {roles.map(r => <option key={r} value={r.toLowerCase()}>{r}</option>)}
          </select>
        </div>
        
        <div className="flex-1 space-y-2">
          <label className="text-sm font-bold text-foreground">Target Level</label>
          <select 
            className="w-full h-12 px-4 rounded-xl shadow-inner border border-border-notion bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">Any Level</option>
            {levels.map(l => <option key={l} value={l.toLowerCase()}>{l}</option>)}
          </select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-bold text-foreground">Location</label>
          <input 
            type="text"
            placeholder="e.g. Ho Chi Minh, Hanoi"
            className="w-full h-12 px-4 rounded-xl shadow-inner border border-border-notion bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button 
          onClick={fetchMatches}
          disabled={loading}
          className="h-12 px-8 rounded-xl bg-primary text-background font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl disabled:opacity-50"
        >
          {loading ? <div className="w-5 h-5 rounded-full border-2 border-background/20 border-t-background animate-spin" /> : <Search size={18} />}
          Find Matches
        </button>
      </div>

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
          <p className="text-sm font-medium mt-2 opacity-70">Make sure you have uploaded and analyzed a CV first.</p>
        </div>
      )}

      {!loading && !error && searched && jobs.length === 0 && (
        <div className="p-12 rounded-[2rem] bg-surface-medium border border-border-notion text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-surface-high flex items-center justify-center">
            <Zap size={32} className="text-muted-notion" />
          </div>
          <p className="text-xl font-bold text-foreground">No matches found for these filters.</p>
          <p className="text-muted-notion max-w-sm">Try broadening your search criteria or wait for new job ingests.</p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid gap-6">
          {jobs.map((item) => (
            <div key={item.jobId} className="group relative p-6 md:p-8 rounded-[2rem] bg-surface-medium border border-border-notion hover:border-primary/30 transition-all duration-300 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors pointer-events-none"></div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-surface-high border border-border-notion flex items-center justify-center shadow-inner">
                      <Briefcase size={20} className="text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-display font-bold text-foreground tracking-tight">{item.title}</h3>
                      <p className="text-sm font-bold text-primary uppercase tracking-widest">{item.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-notion font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="opacity-70" />
                      {item.location || 'Remote'}
                    </div>
                    {item.salaryRange && (
                       <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 font-bold text-xs uppercase">
                         {item.salaryRange}
                       </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.role && (
                      <span className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-surface-high border border-border-notion/50 text-foreground">
                        ROLE: {item.role.toUpperCase()}
                      </span>
                    )}
                    {item.level && (
                      <span className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-surface-high border border-border-notion/50 text-foreground">
                        LEVEL: {item.level.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="text-center md:text-right">
                    <div className="flex items-baseline gap-1 justify-center md:justify-end">
                      <Zap size={16} className="text-primary fill-primary" />
                      <span className="text-4xl font-display font-black text-foreground">
                        {item.matchScore > 100 ? 100 : item.matchScore.toFixed(0)}<span className="text-xl text-muted-notion opacity-50">%</span>
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-muted-notion uppercase tracking-widest mt-1">Vector Match</p>
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <Link
                      href={`/dashboard/jobs/${item.jobId}`}
                      className="px-6 py-3 w-full justify-center rounded-xl bg-foreground text-background text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg active:scale-95"
                    >
                      <BarChart size={16} />
                      Gap Analysis
                    </Link>
                    <a 
                      href={item.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-6 py-3 w-full justify-center rounded-xl bg-surface-high text-foreground border border-border-notion text-sm font-bold flex items-center gap-2 hover:bg-surface-medium transition-all active:scale-95"
                    >
                      Original JD
                      <ExternalLink size={16} opacity={0.5} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
