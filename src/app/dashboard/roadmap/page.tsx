"use client";

import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  MapPin, 
  BookOpen, 
  Briefcase, 
  ArrowRight
} from 'lucide-react';

const roadmapSteps = [
  {
    title: 'Foundations of Systems Architecture',
    status: 'completed',
    type: 'Skill Acquisition',
    description: 'Mastering distributed systems and cloud-native patterns.',
    icon: BookOpen
  },
  {
    title: 'Senior Engineering Role',
    status: 'current',
    type: 'Career Milestone',
    description: 'Transitioning into high-impact leadership positions.',
    icon: Briefcase
  },
  {
    title: 'Advisory & Strategy',
    status: 'upcoming',
    type: 'Long-term Goal',
    description: 'Influencing technical direction at the organizational level.',
    icon: MapPin
  }
];

export default function DashboardRoadmapPage() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-4">
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Curation / Roadmap</p>
        <h1 className="text-5xl font-display font-extrabold tracking-tight text-foreground">Strategic Path</h1>
        <p className="max-w-2xl text-lg text-muted-notion font-medium leading-relaxed">
          Your path is synthesized from 124 data points. Focus on the current milestone to unlock premium opportunities.
        </p>
      </header>

      <div className="relative pt-8 pl-8 space-y-16">
        {/* Timeline Path */}
        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border-notion to-transparent"></div>

        {roadmapSteps.map((step, i) => (
          <div key={i} className="relative group">
            {/* Indicator */}
            <div className={`absolute -left-[37px] top-1 w-6 h-6 rounded-full border-2 bg-background flex items-center justify-center transition-all duration-500 ${
              step.status === 'completed' ? 'border-primary' :
              step.status === 'current' ? 'border-accent-notion scale-125' :
              'border-border-notion'
            }`}>
              {step.status === 'completed' && <CheckCircle2 size={12} className="text-primary" />}
              {step.status === 'current' && <div className="w-2 h-2 rounded-full bg-accent-notion animate-pulse"></div>}
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-surface-high border border-border-notion ${
                    step.status === 'current' ? 'text-accent-notion' : 'text-muted-notion'
                  }`}>
                    {step.type}
                  </span>
                  {step.status === 'current' && (
                    <span className="text-[10px] font-bold text-primary animate-pulse">Active Focus</span>
                  )}
                </div>
                
                <div className="p-8 rounded-[2rem] bg-surface-medium border border-border-notion group-hover:bg-surface-high transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-display font-bold text-foreground tracking-tight">{step.title}</h3>
                    <step.icon className="text-muted-notion" size={24} />
                  </div>
                  <p className="text-muted-notion font-medium leading-relaxed mb-8">
                    {step.description}
                  </p>
                  <button className="flex items-center gap-2 text-sm font-bold text-foreground hover:gap-4 transition-all">
                    Explore Resources
                    <ArrowRight size={16} className="text-primary" />
                  </button>
                </div>
              </div>

              {/* Sidebar Info for step */}
              <div className="hidden lg:block w-48 pt-8 text-right">
                <p className="text-[10px] font-bold text-muted-notion/40 uppercase tracking-widest mb-1">Target Date</p>
                <p className="text-sm font-display font-bold text-muted-notion">Q4 2026</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
