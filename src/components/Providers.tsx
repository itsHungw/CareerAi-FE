"use client";

import React from 'react';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Normally the Google Client ID comes from env
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <AppWrapper>{children}</AppWrapper>
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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 bg-background min-h-screen border-l border-border-notion">
        <div className="max-w-5xl mx-auto px-8 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
