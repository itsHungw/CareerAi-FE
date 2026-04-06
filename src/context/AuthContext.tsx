"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api, { ApiEnvelope, setAccessToken } from '@/lib/axios';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedUser = localStorage.getItem('careerai_user');
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem('careerai_user');
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const hasInitialized = useRef(false);

  // Handle initial session check
  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    const initAuth = async () => {
      const publicPaths = ['/', '/login', '/register'];
      
      try {
        // Attempt silent refresh on app load if we think we might have a session
        // (e.g., if there's a user profile in LS)
        if (getStoredUser()) {
          const response = await api.post<ApiEnvelope<string>>('/auth/refresh');
          setAccessToken(response.data.data);
          // If successful, user is already set from state initialization
        }
      } catch {
        // If refresh fails, clear user if they were set from LS
        setUser(null);
        localStorage.removeItem('careerai_user');
        
        if (!publicPaths.includes(pathname)) {
          router.replace('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [pathname, router]);

  // Sync route protection
  useEffect(() => {
    const publicPaths = ['/', '/login', '/register'];
    if (!loading && !user && !publicPaths.includes(pathname)) {
      router.replace('/login');
      return;
    }

    if (!loading && user && (pathname === '/login' || pathname === '/register')) {
      router.replace('/dashboard');
    }
  }, [user, pathname, router, loading]);

  const loginWithGoogle = async (idToken: string) => {
    try {
      const response = await api.post<ApiEnvelope<AuthPayload>>('/auth/google', { idToken });
      const { accessToken, user: userData } = response.data.data;

      setAccessToken(accessToken);
      localStorage.setItem('careerai_user', JSON.stringify(userData));
      setUser(userData);

      router.replace('/dashboard');
    } catch (error) {
      console.error('Google Login Error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<ApiEnvelope<AuthPayload>>('/auth/login', { email, password });
      const { accessToken, user: userData } = response.data.data;

      setAccessToken(accessToken);
      localStorage.setItem('careerai_user', JSON.stringify(userData));
      setUser(userData);

      router.replace('/dashboard');
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await api.post<ApiEnvelope<AuthPayload>>('/auth/register', { email, password });
      const { accessToken, user: userData } = response.data.data;

      setAccessToken(accessToken);
      localStorage.setItem('careerai_user', JSON.stringify(userData));
      setUser(userData);

      router.replace('/dashboard');
    } catch (error) {
      console.error('Register Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed on server', err);
    } finally {
      setAccessToken(null);
      localStorage.removeItem('careerai_user');
      setUser(null);
      router.replace('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
