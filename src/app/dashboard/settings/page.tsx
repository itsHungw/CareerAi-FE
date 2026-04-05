"use client";

import React from 'react';
import {
  User,
  Shield,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardSettingsPage() {
  const { user, logout } = useAuth();

  const settingsSections = [
    {
      title: 'Profile Intelligence',
      description: 'Manage your public curator identity and personal data.',
      icon: User,
      items: [
        { label: 'Email Address', value: user?.email || 'curator@careerai.com' },
        { label: 'Display Name', value: user?.email?.split('@')[0] || 'Curated User' },
      ]
    },
    {
      title: 'Security Architecture',
      description: 'Configure your authentication protocols and access logs.',
      icon: Shield,
      items: [
        { label: 'Password', value: '************' },
        { label: 'Two-Factor Auth', value: 'Deactivated' },
      ]
    }
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="space-y-4">
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Curation / Account</p>
        <h1 className="text-5xl font-display font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="max-w-2xl text-lg text-muted-notion font-medium leading-relaxed">
          Fine-tune your career curator experience. All changes are synchronized across your career architecture.
        </p>
      </header>

      <div className="space-y-12">
        {settingsSections.map((section, idx) => (
          <section key={idx} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border-notion/30">
              <section.icon size={18} className="text-primary" />
              <div>
                <h2 className="text-xl font-display font-bold text-foreground tracking-tight">{section.title}</h2>
                <p className="text-xs text-muted-notion font-medium">{section.description}</p>
              </div>
            </div>

            <div className="grid gap-2">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  className="flex items-center justify-between p-6 rounded-2xl bg-surface-medium border border-border-notion hover:bg-surface-high transition-all group shadow-sm"
                >
                  <span className="text-sm font-bold text-muted-notion uppercase tracking-widest">{item.label}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">{item.value}</span>
                    <ChevronRight size={16} className="text-muted-notion group-hover:text-foreground transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}

        <section className="pt-8 border-t border-border-notion/30">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-6 py-4 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 text-sm font-bold hover:bg-red-900/30 transition-all"
          >
            <LogOut size={18} />
            Terminate Session
          </button>
        </section>
      </div>
    </div>
  );
}
