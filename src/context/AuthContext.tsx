"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/axios';

interface User {
  id: string; // Updated from number to string for UUID
  email: string;
  role: string;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('careerai_token');
    const storedUser = localStorage.getItem('careerai_user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Route protection logic
  useEffect(() => {
    if (!loading) {
      const publicPaths = ['/login', '/register', '/'];
      if (!user && !publicPaths.includes(pathname)) {
        router.push('/login');
      }
    }
  }, [user, loading, pathname, router]);

  const loginWithGoogle = async (idToken: string) => {
    try {
      const response: any = await api.post('/auth/google', { idToken });
      // Destructure from response.data (ApiResponse.java structure)
      const { token, user: userData } = response.data;
      
      localStorage.setItem('careerai_user', JSON.stringify(userData));
      setUser(userData);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Google Login Error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response: any = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('careerai_token', token);
      localStorage.setItem('careerai_user', JSON.stringify(userData));
      setUser(userData);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response: any = await api.post('/auth/register', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('careerai_token', token);
      localStorage.setItem('careerai_user', JSON.stringify(userData));
      setUser(userData);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Register Error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('careerai_token');
    localStorage.removeItem('careerai_user');
    setUser(null);
    router.push('/');
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
