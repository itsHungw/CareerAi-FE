"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CVData {
  id: string;
  fileName: string;
  fileUrl: string;
  review: string;
  createdAt?: string;
}

interface CVContextType {
  currentCv: CVData | null;
  recentCvs: CVData[];
  addCv: (cv: CVData) => void;
  switchCv: (cvId: string) => void;
  clearCvs: () => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

const STORAGE_KEY = 'career-ai-cvs';
const MAX_RECENT_CVS = 2;

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [currentCv, setCurrentCv] = useState<CVData | null>(null);
  const [recentCvs, setRecentCvs] = useState<CVData[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setRecentCvs(data.cvs || []);
        setCurrentCv(data.current || null);
      }
    } catch (err) {
      console.warn('Failed to load CV data from localStorage:', err);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever CV state changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            cvs: recentCvs,
            current: currentCv,
          })
        );
      } catch (err) {
        console.warn('Failed to save CV data to localStorage:', err);
      }
    }
  }, [currentCv, recentCvs, isHydrated]);

  const addCv = (cv: CVData) => {
    // Check if CV already exists
    const existingIndex = recentCvs.findIndex((c) => c.id === cv.id);

    let updatedCvs: CVData[];
    if (existingIndex >= 0) {
      // Move existing CV to front
      updatedCvs = [cv, ...recentCvs.filter((_, i) => i !== existingIndex)];
    } else {
      // Add new CV to front, keep only last 2
      updatedCvs = [cv, ...recentCvs].slice(0, MAX_RECENT_CVS);
    }

    setRecentCvs(updatedCvs);
    setCurrentCv(cv);
  };

  const switchCv = (cvId: string) => {
    const cv = recentCvs.find((c) => c.id === cvId);
    if (cv) {
      setCurrentCv(cv);
    }
  };

  const clearCvs = () => {
    setCurrentCv(null);
    setRecentCvs([]);
  };

  return (
    <CVContext.Provider value={{ currentCv, recentCvs, addCv, switchCv, clearCvs }}>
      {children}
    </CVContext.Provider>
  );
}

export function useCVContext() {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  return context;
}
