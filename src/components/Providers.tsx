"use client";

import React from 'react';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext";
import { CVProvider } from "@/context/CVContext";
import { usePathname } from 'next/navigation';
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Normally the Google Client ID comes from env
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <CVProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1c1c1c',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '8px',
                fontFamily: 'var(--font-inter)',
              },
            }}
          />
          <AppWrapper>{children}</AppWrapper>
        </CVProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/register';

  if (isPublicPage) {
    return <main className="flex-1 min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 bg-surface-low min-h-screen transition-all duration-300">
        <div className="max-w-6xl mx-auto px-10 py-16">
          {children}
        </div>
      </main>
    </div>
  );
}
