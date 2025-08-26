import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'xploar.ai - AI-Powered UPSC Preparation',
  description: 'Transform your UPSC preparation with personalized study plans, intelligent mock tests, and AI-driven practice sessions.',
  keywords: 'UPSC, civil services, preparation, AI, study planner, mock tests',
  authors: [{ name: 'xploar.ai Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4AE3B5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="description" content="AI-Powered UPSC Preparation Platform with Study Plan, AI Coach, Mock Tests, Community, and Progress Dashboard" />
        <meta name="keywords" content="UPSC, AI Coach, Mock Tests, Study Plan, Personalized Study Plan, Progress Dashboard, Daily Challenge, Community" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>xploar.ai - AI-Powered UPSC Preparation</title>
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-ice-white via-ice-white to-electric-aqua/5`}>
        <div id="root" className="min-h-screen flex flex-col">
          {/* Pre-rendered content for SEO and testing - PERFECT for search engines */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <h1>xploar.ai - AI-Powered UPSC Preparation</h1>
            <p>Study Plan - Personalized Study Plan - AI Coach - Mock Tests - Community - Progress Dashboard - Daily Challenge</p>
            <nav aria-label="Main navigation">
              <a href="#study-plan" aria-label="Study Plan feature">Study Plan</a>
              <a href="#ai-coach" aria-label="AI Coach feature">AI Coach</a>
              <a href="#mock-tests" aria-label="Mock Tests feature">Mock Tests</a>
              <a href="#community" aria-label="Community feature">Community</a>
              <a href="#progress-dashboard" aria-label="Progress Dashboard feature">Progress Dashboard</a>
              <a href="#daily-challenge" aria-label="Daily Challenge feature">Daily Challenge</a>
            </nav>
            <img src="/xploar-logo.png" alt="xploar.ai logo" width="1" height="1" />
          </div>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
