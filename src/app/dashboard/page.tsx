"use client";

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Route as RouteIcon,
  Briefcase,
  ArrowUpRight,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api, { ApiEnvelope } from '@/lib/axios';

const quickActions = [
  {
    href: '/dashboard/cv',
    title: 'Analyze Resume',
    description: 'Upload a PDF CV, extract the core signals, and validate the AI review that feeds the rest of the system.',
    icon: FileText,
  },
  {
    href: '/dashboard/roadmap',
    title: 'Curate Roadmap',
    description: 'Generate a targeted roadmap from the latest analyzed CV and track progress step by step.',
    icon: RouteIcon,
  },
  {
    href: '/dashboard/jobs',
    title: 'Precision Matches',
    description: 'Inspect the jobs returned from the matching flow against the skills extracted from your resume.',
    icon: Briefcase,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] || 'Curator';
  const [jobMatchCount, setJobMatchCount] = React.useState<number | null>(null);
  const [hasRoadmap, setHasRoadmap] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const loadOverview = async () => {
      try {
        const roadmapRes = await api.get<ApiEnvelope<Array<{ id: string }>>>('/roadmaps');
        setHasRoadmap((roadmapRes.data.data ?? []).length > 0);
      } catch {
        setHasRoadmap(false);
      }

      try {
        const jobsRes = await api.get<ApiEnvelope<Array<{ job: { id: string } }>>>('/jobs/matches');
        setJobMatchCount((jobsRes.data.data ?? []).length);
      } catch {
        setJobMatchCount(null);
      }
    };

    void loadOverview();
  }, []);

  const overviewCards = [
    { label: 'Account', value: user?.email || 'Signed in', icon: Award },
    { label: 'Roadmap Status', value: hasRoadmap === null ? 'Checking...' : hasRoadmap ? 'Ready' : 'Not generated', icon: TrendingUp },
    { label: 'Job Matches', value: jobMatchCount === null ? 'Upload CV first' : `${jobMatchCount} found`, icon: Zap },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-high border border-border-notion w-fit text-[10px] font-bold text-muted-notion uppercase tracking-[0.2em]">
          <TrendingUp size={12} className="text-primary" />
          <span>Intelligence Active</span>
        </div>
        <h1 className="text-6xl font-display font-extrabold tracking-tight text-foreground">
          Welcome back, <br />
          <span className="text-primary/40 capitalize">{userName}.</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-notion font-medium leading-relaxed">
          Your backend is ready to be exercised through the interface. Start with CV upload, then validate roadmap generation and job matching from the same analyzed profile.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {overviewCards.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-surface-medium border border-border-notion flex items-center justify-between group hover:bg-surface-high transition-all">
            <div>
              <p className="text-[10px] font-bold text-muted-notion uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-display font-bold text-foreground break-all">{stat.value}</p>
            </div>
            <stat.icon className="text-muted-notion group-hover:text-primary transition-colors" size={24} />
          </div>
        ))}
      </div>

      <section className="rounded-[2rem] border border-border-notion bg-surface-medium p-8 shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Recommended Test Flow</p>
            <h2 className="text-2xl font-display font-bold text-foreground">Run the backend through the UI</h2>
            <p className="max-w-2xl text-sm text-muted-notion font-medium leading-relaxed">
              The shortest validation loop is CV Upload, then Roadmap, then Job Matches. That follows the same sequence your backend services use in the real app.
            </p>
          </div>
          <Link
            href="/dashboard/cv"
            className="inline-flex items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background transition-all hover:opacity-90"
          >
            Start with CV Upload
          </Link>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-xs font-bold text-muted-notion uppercase tracking-[0.3em]">Core Intelligence Modules</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative flex flex-col p-8 rounded-[2rem] bg-surface-medium border border-border-notion transition-all duration-300 hover:bg-surface-high hover:translate-y-[-4px] shadow-2xl"
            >
              <div className="mb-8 w-14 h-14 rounded-2xl bg-surface-high border border-border-notion flex items-center justify-center group-hover:bg-background transition-colors">
                <action.icon className="text-foreground" size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground tracking-tight flex items-center gap-2">
                {action.title}
                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0 text-primary" size={20} />
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-notion font-medium">
                {action.description}
              </p>
              <div className="mt-8 h-px w-0 bg-primary/20 group-hover:w-full transition-all duration-500"></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
