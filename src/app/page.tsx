"use client";

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Target,
  Cpu,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-surface-high">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-border-notion bg-background/60 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-high flex items-center justify-center text-white shrink-0 font-bold text-lg border border-border-notion shadow-inner">
              C
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">CareerAI</span>
          </div>

          <div className="flex items-center gap-8">
            {!loading && user ? (
              <Link 
                href="/dashboard" 
                className="px-5 py-2.5 bg-foreground text-background rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-lg active:scale-95"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-muted-notion hover:text-foreground transition-colors">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-foreground text-background rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-lg active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>

      <main className="pt-40">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center pb-32">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-low border border-border-notion text-muted-notion text-xs font-bold tracking-[0.15em] uppercase">
              <Sparkles size={14} className="text-primary" />
              <span>AI-Powered Career Intelligence</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tight leading-[0.95] text-foreground">
              Stop guessing. <br />
              <span className="text-primary/40">Start building.</span>
            </h1>

            <p className="text-xl text-muted-notion max-w-xl leading-relaxed font-medium">
              The editorial-grade platform for professionals. Parse CVs, generate tailored roadmaps, and master interviews with your personal AI curator.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              {!loading && user ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-10 py-5 bg-foreground text-background rounded-xl text-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 group shadow-2xl"
                >
                  Go to Dashboard
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-10 py-5 bg-foreground text-background rounded-xl text-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 group shadow-2xl"
                  >
                    Build my career now
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-10 py-5 bg-surface-low border border-border-notion rounded-xl text-lg font-bold text-foreground hover:bg-surface-medium transition-all"
                  >
                    View demo
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden lg:block relative p-2 aspect-square rounded-[2rem] bg-gradient-to-br from-surface-medium to-background border border-border-notion overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="flex flex-col h-full bg-surface-low/50 backdrop-blur-sm p-8 space-y-6">
              <div className="h-6 w-32 bg-surface-high rounded-full opacity-50"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-surface-high rounded-full opacity-30"></div>
                <div className="h-4 w-4/5 bg-surface-high rounded-full opacity-30"></div>
                <div className="h-4 w-2/3 bg-surface-high rounded-full opacity-30"></div>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-4">
                <div className="h-24 bg-surface-high rounded-2xl border border-border-notion/50 flex items-center justify-center">
                  <Target className="text-primary opacity-40" />
                </div>
                <div className="h-24 bg-surface-high rounded-2xl border border-border-notion/50 flex items-center justify-center">
                  <Cpu className="text-primary opacity-40" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid - Asymmetric Editorial Style */}
        <section className="bg-surface-low py-32 border-y border-border-notion">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-surface-high border border-border-notion flex items-center justify-center shadow-lg">
                  <Cpu className="text-primary" size={28} />
                </div>
                <h3 className="text-3xl font-display font-bold text-foreground tracking-tight">AI CV Analysis</h3>
                <p className="text-muted-notion leading-relaxed font-medium">
                  Upload your CV and let our curator extract skills, projects, and potential career pivots with high-fidelity accuracy.
                </p>
              </div>

              <div className="space-y-6 lg:mt-16">
                <div className="w-14 h-14 rounded-2xl bg-surface-high border border-border-notion flex items-center justify-center shadow-lg">
                  <Target className="text-primary" size={28} />
                </div>
                <h3 className="text-3xl font-display font-bold text-foreground tracking-tight">Direct Roadmaps</h3>
                <p className="text-muted-notion leading-relaxed font-medium">
                  Receive a step-by-step learning path tailored to your specific goals. Every step is curated for maximum efficiency.
                </p>
              </div>

              <div className="space-y-6 lg:mt-32">
                <div className="w-14 h-14 rounded-2xl bg-surface-high border border-border-notion flex items-center justify-center shadow-lg">
                  <Zap className="text-primary" size={28} />
                </div>
                <h3 className="text-3xl font-display font-bold text-foreground tracking-tight">Interview Mastery</h3>
                <p className="text-muted-notion leading-relaxed font-medium">
                  Practice with an intelligent coach that adapts to your career goals and provides immediate, actionable feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-border-notion">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-surface-high flex items-center justify-center text-white font-bold text-xs border border-border-notion">
                C
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-foreground">CareerAI Builder</span>
            </div>

            <div className="flex gap-10 text-sm font-bold text-muted-notion uppercase tracking-[0.1em]">
              <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Github</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            </div>

            <p className="text-sm text-muted-notion font-medium">
              © {new Date().getFullYear()} CareerAI.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
