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
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const quickActions = [
  {
    href: '/dashboard/cv',
    title: 'Analyze Resume',
    description: 'Deconstruct your skills and experience using high-fidelity AI models.',
    icon: FileText,
    color: 'text-primary'
  },
  {
    href: '/dashboard/roadmap',
    title: 'Curate Roadmap',
    description: 'Generate a precision-engineered career path with vetted resources.',
    icon: RouteIcon,
    color: 'text-primary'
  },
  {
    href: '/dashboard/jobs',
    title: 'Precision Matches',
    description: 'Find opportunities that align perfectly with your curated profile.',
    icon: Briefcase,
    color: 'text-primary'
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] || 'Curator';

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Header Section */}
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
          Your career architecture is ready for refinement. Start with a fresh analysis or review your existing roadmaps.
        </p>
      </header>

      {/* Quick Summary / Stats Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Analysis Score', value: '88/100', icon: Zap },
          { label: 'Roadmap Progress', value: '12%', icon: TrendingUp },
          { label: 'Certifications', value: '4 Active', icon: Award },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-surface-medium border border-border-notion flex items-center justify-between group hover:bg-surface-high transition-all">
            <div>
              <p className="text-[10px] font-bold text-muted-notion uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            </div>
            <stat.icon className="text-muted-notion group-hover:text-primary transition-colors" size={24} />
          </div>
        ))}
      </div>

      {/* Main Actions */}
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
              
              {/* Decorative line */}
              <div className="mt-8 h-px w-0 bg-primary/20 group-hover:w-full transition-all duration-500"></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
