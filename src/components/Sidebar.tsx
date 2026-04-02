"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Route, 
  Briefcase, 
  Settings,
  ChevronLeft,
  Search,
  Plus
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: FileText, label: 'CV Upload', href: '/cv' },
  { icon: Route, label: 'Career Roadmap', href: '/roadmap' },
  { icon: Briefcase, label: 'Job Matches', href: '/jobs' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-border-notion flex flex-col transition-all duration-200">
      {/* Header / Workspace Info */}
      <div className="p-4 flex items-center justify-between group">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-md bg-accent-notion flex items-center justify-center text-white shrink-0 font-bold text-lg italic">
            C
          </div>
          <span className="font-semibold text-sm truncate">CareerAI Builder</span>
        </div>
        <button className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded transition-colors opacity-0 group-hover:opacity-100 italic">
          <ChevronLeft size={16} className="text-muted-notion" />
        </button>
      </div>

      {/* Global Actions */}
      <div className="px-2 mb-4 space-y-0.5">
        <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors pointer-default italic">
          <Search size={16} className="text-muted-notion italic" />
          <span className="text-muted-notion italic">Search</span>
        </button>
        <button className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors group italic">
           <div className="flex items-center gap-2 italic">
            <Plus size={16} className="text-muted-notion italic" />
            <span className="italic">New Roadmap</span>
           </div>
           <span className="text-[10px] bg-gray-200 dark:bg-zinc-600 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity italic">⌘N</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-0.5">
        <div className="px-2 py-1 text-[10px] font-semibold text-muted-notion uppercase tracking-wider mb-1 italic">
          Overview
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors italic",
                isActive 
                  ? "bg-gray-200 dark:bg-zinc-700 font-medium text-foreground italic" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 italic"
              )}
            >
              <item.icon 
                size={16} 
                className={cn(isActive ? "text-foreground italic" : "text-muted-notion italic")} 
              />
              <span className="italic">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Settings */}
      <div className="p-2 border-t border-border-notion space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors italic"
        >
          <Settings size={16} className="text-muted-notion italic" />
          <span className="italic">Settings</span>
        </Link>
        <div className="flex items-center justify-between p-2 mt-2 group rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer italic">
          <div className="flex items-center gap-2 italic">
            <div className="w-6 h-6 rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-[10px] font-medium shrink-0">
              V
            </div>
            <div className="overflow-hidden italic">
              <p className="text-xs font-semibold truncate italic">vinhung</p>
              <p className="text-[10px] text-muted-notion truncate italic">Free Plan</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
