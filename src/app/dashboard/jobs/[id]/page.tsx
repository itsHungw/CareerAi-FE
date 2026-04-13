"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  Sparkles,
  ExternalLink
} from 'lucide-react';

import api, { ApiClientError, ApiEnvelope } from '@/lib/axios';

interface GapAnalysisResult {
  jobId: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
  aiExplanation: string;
}

export default function JobAnalysisPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [analysis, setAnalysis] = useState<GapAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const response = await api.get<ApiEnvelope<GapAnalysisResult>>(`/jobs/${id}/analysis`);
        setAnalysis(response.data.data);
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : 'Failed to generate gap analysis');
      } finally {
        setLoading(false);
      }
    };

    void fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex items-center justify-between">
            <div className="w-32 h-10 rounded-xl bg-surface-medium animate-pulse"></div>
        </div>
        <div className="h-64 rounded-[2rem] bg-surface-medium animate-pulse border border-border-notion"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-48 rounded-[2xl] bg-surface-medium animate-pulse border border-border-notion"></div>
            <div className="h-48 rounded-[2xl] bg-surface-medium animate-pulse border border-border-notion"></div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <button onClick={() => router.back()} className="text-muted-notion hover:text-foreground font-bold flex items-center gap-2 transition-colors">
          <ArrowLeft size={18} /> Back to Jobs
        </button>
        <div className="p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-500 text-center font-bold">
          {error || 'Analysis not found'}
          <p className="text-sm font-medium mt-2 opacity-70">Make sure your CV is uploaded and analyzed before checking matches.</p>
        </div>
      </div>
    );
  }

  // Helper to safely render markdown without external deps (simple bold/list conversion to JSX)
  const renderAiExplanation = (text: string) => {
    if (!text) return null;
    
    // Split by double newline for paragraphs/sections
    const blocks = text.split('\n\n');
    return blocks.map((block, i) => {
      if (block.startsWith('## ')) {
        return <h3 key={i} className="text-xl font-display font-bold text-foreground mt-6 mb-2">{block.replace('## ', '')}</h3>;
      }
      if (block.startsWith('### ')) {
        return <h4 key={i} className="text-lg font-bold text-foreground mt-4 mb-2">{block.replace('### ', '')}</h4>;
      }
      if (block.includes('\n- ') || block.startsWith('- ')) {
        // It's a list
        const items = block.split('\n').filter(l => l.trim().length > 0);
        return (
          <ul key={i} className="space-y-2 my-4 list-none">
            {items.map((item, j) => {
               let liText = item.startsWith('- ') ? item.substring(2) : item;
               // Basic bold parsing 
               // Note: This is rudimentary, enough for our AI output without 3rd party libs
               const parts = liText.split(/\*\*(.*?)\*\*/g);
               return (
                 <li key={j} className="flex gap-3 text-muted-notion leading-relaxed">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                   <span>
                   {parts.map((part, k) => k % 2 === 1 ? <strong key={k} className="text-foreground">{part}</strong> : part)}
                   </span>
                 </li>
               )
            })}
          </ul>
        );
      }
      
      // Regular paragraph
      const parts = block.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-muted-notion leading-relaxed my-3 font-medium">
          {parts.map((part, k) => k % 2 === 1 ? <strong key={k} className="text-foreground">{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header / Nav */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
            <button onClick={() => router.back()} className="text-muted-notion hover:text-foreground font-bold flex items-center gap-2 transition-colors -ml-1 py-2">
            <ArrowLeft size={16} /> Back to Matches
            </button>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">AI Fit Analysis</p>
            <h1 className="text-4xl font-display font-extrabold tracking-tight text-foreground">{analysis.jobTitle}</h1>
            <p className="text-lg text-muted-notion font-bold tracking-widest uppercase flex items-center gap-2">
                <Briefcase size={16} /> {analysis.company}
            </p>
        </div>
        
        <div className="p-4 rounded-2xl bg-surface-high border border-border-notion flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Zap className="text-primary" size={24} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-muted-notion uppercase tracking-widest">Match Score</p>
                <div className="text-3xl font-display font-black text-foreground">
                    {analysis.matchScore > 100 ? 100 : analysis.matchScore.toFixed(0)}<span className="text-lg opacity-50">%</span>
                </div>
            </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Missing Skills */}
          <div className="p-8 rounded-[2rem] bg-red-500/5 border border-red-500/20 relative overflow-hidden group hover:border-red-500/40 transition-colors">
             <div className="absolute top-0 right-0 p-6 opacity-10 text-red-500 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-125 transition-transform duration-500 pointer-events-none">
                 <XCircle size={150} />
             </div>
             <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                     <AlertCircle className="text-red-500" size={24} />
                     <h3 className="text-2xl font-display font-bold text-foreground">Gaps to Close</h3>
                     <span className="ml-auto font-bold bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs">
                         {analysis.missingSkills.length} found
                     </span>
                 </div>
                 <p className="text-sm font-medium text-muted-notion">Prioritize these skills to maximize your chances landing the role.</p>
                 
                 <div className="flex flex-wrap gap-2">
                     {analysis.missingSkills.length === 0 ? (
                         <span className="text-sm font-bold text-foreground opacity-50">No skill gaps detected!</span>
                     ) : (
                         analysis.missingSkills.map(skill => (
                             <span key={skill} className="text-xs font-bold px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg shadow-sm">
                                 {skill}
                             </span>
                         ))
                     )}
                 </div>
             </div>
          </div>

          {/* Matching Skills */}
          <div className="p-8 rounded-[2rem] bg-green-500/5 border border-green-500/20 relative overflow-hidden group hover:border-green-500/40 transition-colors">
             <div className="absolute top-0 right-0 p-6 opacity-10 text-green-500 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-125 transition-transform duration-500 pointer-events-none">
                 <CheckCircle2 size={150} />
             </div>
             <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                     <CheckCircle2 className="text-green-500" size={24} />
                     <h3 className="text-2xl font-display font-bold text-foreground">Your Strengths</h3>
                     <span className="ml-auto font-bold bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs">
                         {analysis.matchingSkills.length} aligned
                     </span>
                 </div>
                 <p className="text-sm font-medium text-muted-notion">These existing skills perfectly align with the employer's needs.</p>
                 
                 <div className="flex flex-wrap gap-2">
                     {analysis.matchingSkills.length === 0 ? (
                         <span className="text-sm font-bold text-foreground opacity-50">No direct matches.</span>
                     ) : (
                         analysis.matchingSkills.map(skill => (
                             <span key={skill} className="text-xs font-bold px-3 py-1.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg shadow-sm">
                                 {skill}
                             </span>
                         ))
                     )}
                 </div>
             </div>
          </div>
      </div>

      {/* AI Explanation / Advice */}
      {analysis.aiExplanation && (
          <div className="p-8 md:p-10 rounded-[2.5rem] bg-surface-medium border border-border-notion relative shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 blur-xl rounded-full"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 blur-2xl rounded-full"></div>
              
              <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border-notion">
                      <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center rotate-3 shadow-lg">
                          <Sparkles size={28} />
                      </div>
                      <div>
                          <h2 className="text-2xl font-display font-extrabold text-foreground">Copilot Review</h2>
                          <p className="text-sm text-muted-notion font-bold">Personalized assessment based on your comprehensive profile</p>
                      </div>
                  </div>

                  <div className="prose prose-invert prose-notion max-w-none">
                      {renderAiExplanation(analysis.aiExplanation)}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
