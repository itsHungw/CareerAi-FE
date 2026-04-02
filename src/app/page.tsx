"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Target, 
  Cpu, 
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#37352F] font-sans selection:bg-[#FDECC8]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-[#E9E9E7] bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#37352F] flex items-center justify-center text-white shrink-0 font-bold text-lg">
              C
            </div>
            <span className="font-bold text-lg tracking-tight">CareerAI</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium hover:text-[#0B6E99] transition-colors">
              Log in
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 bg-[#37352F] text-white rounded-md text-sm font-medium hover:bg-[#4A4842] transition-all shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-6 text-center pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F1EF] text-[#9B9A97] text-xs font-semibold mb-8 animate-fade-in">
            <Sparkles size={12} className="text-[#D9730D]" />
            <span>AI-Powered Career Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-[#37352F]">
            Stop guessing your career path. <br />
            <span className="text-[#9B9A97]">Start building it with AI.</span>
          </h1>
          
          <p className="text-xl text-[#6B6B6B] max-w-2xl mx-auto mb-10 leading-relaxed">
            The intelligent platform for modern professionals. Parse CVs, generate tailored roadmaps, and master interviews with your personal AI coach.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-[#37352F] text-white rounded-lg text-lg font-semibold hover:bg-[#4A4842] transition-all flex items-center justify-center gap-2 group shadow-lg"
            >
              Build my career now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-white border border-[#E9E9E7] rounded-lg text-lg font-semibold hover:bg-[#F7F6F3] transition-all"
            >
              View demo
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-[#F7F6F3] py-24 border-y border-[#E9E9E7]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E9E9E7] flex items-center justify-center shadow-sm">
                  <Cpu className="text-[#37352F]" />
                </div>
                <h3 className="text-xl font-bold">AI CV Analysis</h3>
                <p className="text-[#5F5E5B] leading-relaxed">
                  Upload your CV and let our AI extract skills, projects, and potential career pivots in seconds.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E9E9E7] flex items-center justify-center shadow-sm">
                  <Target className="text-[#37352F]" />
                </div>
                <h3 className="text-xl font-bold">Direct Roadmaps</h3>
                <p className="text-[#5F5E5B] leading-relaxed">
                  Get a step-by-step learning path tailored to your dream job, including resources and projects.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E9E9E7] flex items-center justify-center shadow-sm">
                  <Zap className="text-[#37352F]" />
                </div>
                <h3 className="text-xl font-bold">Interview Mastery</h3>
                <p className="text-[#5F5E5B] leading-relaxed">
                  Practice with an AI that knows your specific career goals and provides real-time feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-24 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Designed for the next generation of talent.</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              "Minimalist Interface",
              "Privacy First",
              "No Gradients",
              "Real-time Analysis",
              "Export to PDF",
              "Dark Mode Ready"
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 justify-center text-[#5F5E5B] font-medium">
                <CheckCircle2 size={16} className="text-[#448361]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#E9E9E7] py-12">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#37352F] flex items-center justify-center text-white font-bold text-xs">
                C
              </div>
              <span className="font-bold text-sm">CareerAI Builder</span>
            </div>
            
            <div className="flex gap-8 text-sm text-[#9B9A97]">
              <Link href="#" className="hover:text-[#37352F]">Twitter</Link>
              <Link href="#" className="hover:text-[#37352F]">Github</Link>
              <Link href="#" className="hover:text-[#37352F]">Terms</Link>
              <Link href="#" className="hover:text-[#37352F]">Privacy</Link>
            </div>
            
            <p className="text-sm text-[#9B9A97]">
              © {new Date().getFullYear()} CareerAI. All rights reserved.
            </p>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
