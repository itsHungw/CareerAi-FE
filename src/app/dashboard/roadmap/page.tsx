"use client";

import React from 'react';
import {
  CheckCircle2,
  MapPin,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

import api, { ApiClientError, ApiEnvelope } from '@/lib/axios';
import { useCVContext } from '@/context/CVContext';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  orderIndex: number;
  durationDays: number;
  resources: string;
}

interface Roadmap {
  id: string;
  targetTitle: string;
  status: string;
  createdAt: string;
}

interface GenerateRoadmapRequest {
  targetTitle?: string;
}

function parseResources(resources: string): string[] {
  try {
    const parsed = JSON.parse(resources) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function DashboardRoadmapPage() {
  const [roadmap, setRoadmap] = React.useState<Roadmap | null>(null);
  const [steps, setSteps] = React.useState<RoadmapStep[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [targetTitle, setTargetTitle] = React.useState('');
  const [showCVReview, setShowCVReview] = React.useState(false);

  const { currentCv } = useCVContext();

  const loadRoadmap = React.useCallback(async () => {
    try {
      const roadmapsRes = await api.get<ApiEnvelope<Roadmap[]>>('/roadmaps');
      const activeRoadmap = roadmapsRes.data.data[0] ?? null;
      setRoadmap(activeRoadmap);

      if (activeRoadmap) {
        const stepsRes = await api.get<ApiEnvelope<RoadmapStep[]>>(`/roadmaps/${activeRoadmap.id}/steps`);
        setSteps(stepsRes.data.data);
        setTargetTitle(activeRoadmap.targetTitle);
      } else {
        setSteps([]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadRoadmap();
  }, [loadRoadmap]);

  const generateRoadmap = async () => {
    setGenerating(true);
    setError(null);

    try {
      const payload: GenerateRoadmapRequest = {};
      if (targetTitle.trim()) {
        payload.targetTitle = targetTitle.trim();
      }

      await api.post<ApiEnvelope<Roadmap>>('/roadmaps/generate', payload);
      await loadRoadmap();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
  };

  const toggleStatus = async (stepId: string, currentStatus: RoadmapStep['status']) => {
    const nextStatus: RoadmapStep['status'] = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    try {
      await api.patch<ApiEnvelope<RoadmapStep>>(`/roadmaps/steps/${stepId}/status?status=${nextStatus}`);
      setSteps((prev) => prev.map((step) => step.id === stepId ? { ...step, status: nextStatus } : step));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to update step status');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-4">
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Curation / Roadmap</p>
        <h1 className="text-5xl font-display font-extrabold tracking-tight text-foreground">Strategic Path</h1>
        <p className="max-w-2xl text-lg text-muted-notion font-medium leading-relaxed">
          Generate a targeted plan from your latest CV, then track execution step by step from the same dashboard.
        </p>
      </header>

      <section className="rounded-[2rem] bg-surface-medium border border-border-notion p-8 shadow-2xl space-y-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-notion uppercase tracking-[0.3em]">Roadmap Generator</p>
          <h2 className="text-2xl font-display font-bold text-foreground">Generate from your latest CV</h2>
          <p className="max-w-2xl text-sm text-muted-notion font-medium leading-relaxed">
            Enter a target role if you already know it. If you leave it blank, the backend infers a reasonable direction from the skills found in your latest uploaded CV.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <input
            type="text"
            value={targetTitle}
            onChange={(event) => setTargetTitle(event.target.value)}
            placeholder="Example: Backend Developer, Frontend Developer, Fullstack Developer"
            className="flex-1 rounded-xl border border-border-notion bg-surface-high px-4 py-3 text-sm text-foreground placeholder:text-muted-notion/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={generateRoadmap}
            disabled={generating || loading}
            className="px-6 py-3 rounded-xl bg-foreground text-background text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate Roadmap'}
          </button>
        </div>

        {roadmap && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl bg-surface-high border border-border-notion/50 p-5">
            <div>
              <p className="text-[10px] font-bold text-muted-notion uppercase tracking-[0.2em]">Active Target</p>
              <h3 className="text-xl font-display font-bold text-foreground">{roadmap.targetTitle}</h3>
            </div>
            <p className="text-sm text-muted-notion font-medium">
              Created {new Date(roadmap.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </section>

      {/* Current CV Review Section */}
      {currentCv && (
        <section className="rounded-[2rem] bg-surface-medium border border-border-notion p-8 shadow-2xl space-y-4">
          <button
            onClick={() => setShowCVReview(!showCVReview)}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Current CV Context</p>
              <div className="h-px flex-1 bg-primary/30 group-hover:bg-primary/50 transition-all"></div>
            </div>
            <div className="text-xs text-muted-notion">{currentCv.fileName}</div>
          </button>

          {showCVReview && (
            <div className="p-6 rounded-xl bg-surface-high border border-border-notion/50 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-sm leading-6 text-foreground/90 font-medium whitespace-pre-wrap">
                {currentCv.review || 'No review available'}
              </p>
            </div>
          )}
        </section>
      )}

      {loading && (
        <div className="space-y-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-[2rem] bg-surface-medium border border-border-notion"></div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-500 text-center font-bold">
          {error}
        </div>
      )}

      {!loading && !error && !roadmap && (
        <div className="p-12 rounded-[2rem] bg-surface-medium border border-border-notion text-center flex flex-col items-center gap-6">
          <MapPin size={48} className="text-muted-notion" />
          <p className="text-xl font-bold text-foreground">No active roadmap found.</p>
          <p className="max-w-md text-sm text-muted-notion font-medium leading-relaxed">
            Upload a CV first, then generate a roadmap from the analyzed skills and summary stored in the backend.
          </p>
          <Link href="/dashboard/cv" className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-xl hover:opacity-90 transition-all">
            Upload CV First
          </Link>
        </div>
      )}

      {!loading && !error && roadmap && (
        <div className="relative pt-8 pl-8 space-y-16">
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border-notion to-transparent"></div>

          {steps.map((step, index) => {
            const resources = parseResources(step.resources);

            return (
              <div key={step.id} className="relative group">
                <button
                  onClick={() => toggleStatus(step.id, step.status)}
                  className={`absolute -left-[37px] top-1 w-6 h-6 rounded-full border-2 bg-background flex items-center justify-center transition-all duration-500 z-20 ${
                    step.status === 'DONE' ? 'border-primary' :
                    step.status === 'IN_PROGRESS' ? 'border-accent-notion scale-125' :
                    'border-border-notion hover:border-primary/50'
                  }`}
                >
                  {step.status === 'DONE' && <CheckCircle2 size={12} className="text-primary" />}
                  {step.status === 'IN_PROGRESS' && <div className="w-2 h-2 rounded-full bg-accent-notion animate-pulse"></div>}
                </button>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-surface-high border border-border-notion ${step.status === 'DONE' ? 'text-primary' : 'text-muted-notion'}`}>
                        Step {index + 1}
                      </span>
                      {step.status === 'IN_PROGRESS' && (
                        <span className="text-[10px] font-bold text-primary animate-pulse">Active Focus</span>
                      )}
                    </div>

                    <div className="p-8 rounded-[2rem] bg-surface-medium border border-border-notion group-hover:bg-surface-high transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-display font-bold text-foreground tracking-tight">{step.title}</h3>
                        <BookOpen className="text-muted-notion" size={24} />
                      </div>
                      <p className="text-muted-notion font-medium leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {resources.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                          {resources.map((resource) => (
                            <span key={resource} className="text-[10px] font-bold px-2 py-1 rounded-md bg-surface-high border border-border-notion text-muted-notion uppercase tracking-widest">
                              {resource}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                          Execution checkpoint
                          <ArrowRight size={16} className="text-primary" />
                        </span>
                        <span className="text-[10px] font-bold text-muted-notion uppercase tracking-widest">
                          Est. {step.durationDays} Days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block w-48 pt-8 text-right">
                    <p className="text-[10px] font-bold text-muted-notion/40 uppercase tracking-widest mb-1">Target Achievement</p>
                    <p className="text-sm font-display font-bold text-muted-notion">
                      #{step.orderIndex + 1} Milestone
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
