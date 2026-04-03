"use client";

import React from 'react';
import Link from 'next/link';
import { FileText, Route as RouteIcon, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const quickActions = [
  {
    href: '/dashboard/cv',
    title: 'Upload CV',
    description: 'Tai CV PDF va lay noi dung phan tich.',
    icon: FileText,
  },
  {
    href: '/dashboard/roadmap',
    title: 'Career Roadmap',
    description: 'Xem huong mo rong cho luong roadmap nghe nghiep.',
    icon: RouteIcon,
  },
  {
    href: '/dashboard/jobs',
    title: 'Job Matches',
    description: 'Khu vuc cho tinh nang goi y cong viec.',
    icon: Briefcase,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-notion">Overview</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-notion">
          {user ? `Dang dang nhap voi ${user.email}.` : 'Ban da dang nhap thanh cong.'} Bat dau tu khu vuc upload CV hoac mo cac module dang duoc hoan thien.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-2xl border border-border-notion bg-white p-5 transition-colors hover:bg-stone-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <action.icon className="mb-4 text-foreground" size={20} />
            <h2 className="text-lg font-semibold text-foreground">{action.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-notion">{action.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
