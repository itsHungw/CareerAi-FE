"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ApiClientError } from '@/lib/axios';
import { Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Local state for registration
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password);
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Registration failed. Email might already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-10 p-10 rounded-2xl border border-border-notion bg-surface-medium shadow-2xl">
        
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-surface-high flex items-center justify-center text-foreground font-bold text-2xl border border-border-notion shadow-inner">
            C
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-display font-extrabold tracking-tight text-foreground">Create Account</h1>
            <p className="text-xs font-bold text-muted-notion uppercase tracking-widest leading-relaxed">Join the curator elite</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-notion transition-colors group-focus-within:text-foreground" size={16} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border-notion bg-surface-high text-foreground placeholder:text-muted-notion/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-notion transition-colors group-focus-within:text-foreground" size={16} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border-notion bg-surface-high text-foreground placeholder:text-muted-notion/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-notion transition-colors group-focus-within:text-foreground" size={16} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border-notion bg-surface-high text-foreground placeholder:text-muted-notion/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground text-background py-3 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Sign up"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-notion font-bold uppercase tracking-wider">
          Already have an account?{' '}
          <Link href="/login" className="text-foreground hover:underline decoration-primary decoration-2 underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>

      <div className="fixed bottom-12 text-[12vw] font-display font-black text-white/[0.03] select-none -z-10 tracking-[10px] whitespace-nowrap overflow-hidden">
        CAREERAI BUILDER
      </div>
    </div>
  );
}
