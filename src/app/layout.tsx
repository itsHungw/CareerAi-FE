import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareerAI Builder",
  description: "Advanced AI Career Platform for IT Students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="flex min-h-screen">
          {/* Main Sidebar Shell */}
          <Sidebar />
          
          {/* Content Area */}
          <main className="flex-1 ml-64 bg-background min-h-screen border-l border-border-notion">
            <div className="max-w-5xl mx-auto px-8 py-12">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
