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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#FBFBFA] border-r border-[#E9E9E7] flex flex-col transition-all duration-200">
      {/* Header / Workspace Info */}
      <div className="p-4 flex items-center justify-between group">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-md bg-[#37352F] flex items-center justify-center text-white shrink-0 font-bold text-lg">
            C
          </div>
          <span className="font-semibold text-sm truncate text-[#37352F]">CareerAI Builder</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-0.5 mt-4">
        <div className="px-2 py-1 text-[10px] font-semibold text-[#9B9A97] uppercase tracking-wider mb-1">
          Overview
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors",
                isActive 
                  ? "bg-[#EBEBE9] font-medium text-[#37352F]" 
                  : "text-[#5F5E5B] hover:bg-[#EBEBE9] hover:text-[#37352F]"
              )}
            >
              <item.icon 
                size={16} 
                className={cn(isActive ? "text-[#37352F]" : "text-[#9B9A97]")} 
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Settings */}
      <div className="p-2 border-t border-[#E9E9E7] space-y-0.5">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 px-2 py-1.5 text-sm rounded text-[#5F5E5B] hover:bg-[#EBEBE9] hover:text-[#37352F] transition-colors"
        >
          <Settings size={16} />
          <span>Settings</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded text-[#5F5E5B] hover:bg-red-50 hover:text-red-600 transition-colors group"
        >
          <LogOut size={16} className="group-hover:text-red-600" />
          <span>Logout</span>
        </button>
        
        {user && (
          <div className="flex items-center gap-2 p-2 mt-2 rounded bg-[#F7F6F3] border border-[#E9E9E7]">
            <div className="w-8 h-8 rounded-full bg-[#EBEBE9] flex items-center justify-center shrink-0">
              <UserIcon size={14} className="text-[#9B9A97]" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-semibold truncate text-[#37352F]">{user.email.split('@')[0]}</p>
              <p className="text-[9px] text-[#9B9A97] truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
