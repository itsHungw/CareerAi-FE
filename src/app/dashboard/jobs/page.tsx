"use client";

import React from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Star,
  ExternalLink,
  Zap
} from 'lucide-react';

const mockJobs = [
  {
    id: 1,
    title: 'Senior Systems Architect',
    company: 'Neural Nexus',
    location: 'Remote / San Francisco',
    salary: '$180k - $240k',
    match: 94,
    tags: ['Distributed Systems', 'Go', 'Kubernetes']
  },
  {
    id: 2,
    title: 'Principal Software Engineer',
    company: 'Aether Cloud',
    location: 'Austin, TX',
    salary: '$160k - $210k',
    match: 88,
    tags: ['PostgreSQL', 'Java', 'Cloud Native']
  },
  {
    id: 3,
    title: 'Lead Backend Developer',
    company: 'Scale Ops',
    location: 'Hybrid / New York',
    salary: '$150k - $190k',
    match: 82,
    tags: ['Python', 'Scalability', 'Redis']
  }
];

export default function DashboardJobsPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Curation / Opportunities</p>
        <h1 className="text-5xl font-display font-extrabold tracking-tight text-foreground">Precision Matches</h1>
        <p className="max-w-2xl text-lg text-muted-notion font-medium leading-relaxed">
          Opportunities identified through cross-referencing your analyzed skills with current market demands.
        </p>
      </header>

      <div className="grid gap-6">
        {mockJobs.map((job) => (
          <div key={job.id} className="group relative p-8 rounded-[2rem] bg-surface-medium border border-border-notion hover:bg-surface-high transition-all duration-300 shadow-xl overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] group-hover:bg-primary/10 transition-colors"></div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-high border border-border-notion flex items-center justify-center">
                    <Briefcase size={20} className="text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-foreground tracking-tight">{job.title}</h3>
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">{job.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-notion font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    {job.salary}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {job.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-muted-notion px-2 py-1 rounded-md bg-surface-high border border-border-notion/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Zap size={14} className="text-primary" />
                    <span className="text-2xl font-display font-bold text-foreground">{job.match}%</span>
                  </div>
                  <p className="text-[10px] font-bold text-muted-notion uppercase tracking-widest">Match Score</p>
                </div>
                
                <button className="px-6 py-3 rounded-xl bg-foreground text-background text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg">
                  Apply Now
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
