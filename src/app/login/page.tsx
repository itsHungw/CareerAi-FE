"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, AlertCircle, Loader2, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const { loginWithGoogle, login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Local state for email login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle(credentialResponse.credential);
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8 p-8 rounded-2xl border border-border-notion bg-white dark:bg-zinc-900 shadow-sm">
        
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="w-10 h-10 rounded-lg bg-accent-notion flex items-center justify-center text-white font-bold text-xl italic">
            C
          </div>
          <h1 className="text-xl font-bold tracking-tight italic">Welcome Back</h1>
          <p className="text-xs text-muted-notion italic">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-notion italic" size={14} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border-notion bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-accent-notion transition-all italic"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-notion italic" size={14} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border-notion bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-accent-notion transition-all italic"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground text-background hover:bg-zinc-800 dark:hover:bg-zinc-200 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 italic"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin italic" /> : "Sign in"}
          </button>
        </form>

        <div className="relative flex items-center justify-center py-2">
          <div className="flex-grow border-t border-border-notion"></div>
          <span className="flex-shrink mx-4 text-[10px] text-muted-notion uppercase tracking-widest italic">or</span>
          <div className="flex-grow border-t border-border-notion"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed.')}
            useOneTap
            theme="outline"
            width="100%"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs border border-red-100 dark:border-red-900/30 italic">
            <AlertCircle size={14} className="italic" />
            <span className="italic">{error}</span>
          </div>
        )}

        <p className="text-center text-xs text-muted-notion italic">
          Don't have an account?{' '}
          <Link href="/register" className="text-accent-notion hover:underline font-medium italic">
            Sign up
          </Link>
        </p>
      </div>

      <div className="fixed bottom-8 text-[120px] font-black text-zinc-50 dark:text-zinc-900/10 select-none -z-10 tracking-tighter opacity-50 italic">
        CAREERAI
      </div>
    </div>
  );
}

