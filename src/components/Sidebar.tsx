"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Route as RouteIcon,
  Briefcase,
  Settings,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'CV Upload', href: '/dashboard/cv' },
  { icon: RouteIcon, label: 'Career Roadmap', href: '/dashboard/roadmap' },
  { icon: Briefcase, label: 'Job Matches', href: '/dashboard/jobs' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-background flex flex-col transition-all duration-200">
      {/* Header / Workspace Info */}
      <div className="p-6 flex items-center justify-between group">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-surface-high flex items-center justify-center text-white shrink-0 font-bold text-lg border border-border-notion">
            C
          </div>
          <Link href="/" className="font-display font-semibold text-base tracking-tight truncate text-foreground hover:opacity-80 transition-opacity">
            CareerAI
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-6">
        <div className="px-3 py-2 text-[10px] font-bold text-muted-notion uppercase tracking-[0.2em] mb-2">
          Overview
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                isActive
                  ? "bg-surface-high font-medium text-foreground"
                  : "text-muted-notion hover:bg-surface-low hover:text-foreground"
              )}
            >
              <item.icon
                size={18}
                className={cn(isActive ? "text-foreground" : "text-muted-notion")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Settings */}
      <div className="p-4 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-muted-notion hover:bg-surface-low hover:text-foreground transition-all"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-muted-notion hover:bg-red-950/30 hover:text-red-400 transition-all font-medium group"
        >
          <LogOut size={18} className="group-hover:text-red-400" />
          <span>Logout</span>
        </button>

        {user && (
          <div className="flex items-center gap-3 p-3 mt-4 rounded-xl bg-surface-low border border-border-notion">
            <div className="w-9 h-9 rounded-full bg-surface-high flex items-center justify-center shrink-0 border border-border-notion">
              <UserIcon size={16} className="text-foreground" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-foreground">{user.email.split('@')[0]}</p>
              <p className="text-[10px] text-muted-notion truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
