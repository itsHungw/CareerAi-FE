"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { ApiClientError } from '@/lib/axios';
import { Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const { loginWithGoogle, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Local state for email login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google did not return a valid credential.');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Failed to login with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Invalid email or password.');
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
            <h1 className="text-2xl font-display font-extrabold tracking-tight text-foreground">Welcome Back</h1>
            <p className="text-xs font-bold text-muted-notion uppercase tracking-widest leading-relaxed">Curation of your career continues</p>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-6">
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground text-background py-3 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Sign in"}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="flex-grow border-t border-border-notion/50"></div>
          <span className="flex-shrink mx-4 text-[10px] text-muted-notion font-bold uppercase tracking-[0.2em]">Authenticating via</span>
          <div className="flex-grow border-t border-border-notion/50"></div>
        </div>

        <div className="flex justify-center scale-105">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google login failed.')}
            theme="filled_black"
            shape="pill"
            width="320"
          />
        </div>

        <p className="text-center text-xs text-muted-notion font-bold uppercase tracking-wider">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-foreground hover:underline decoration-primary decoration-2 underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>

      <div className="fixed bottom-12 text-[12vw] font-display font-black text-white/[0.03] select-none -z-10 tracking-[10px] whitespace-nowrap overflow-hidden">
        CAREERAI BUILDER
      </div>
    </div>
  );
}
