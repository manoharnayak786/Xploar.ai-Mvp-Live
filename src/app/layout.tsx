import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/layout/MainLayout';

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
      <body className={`${inter.className} antialiased`}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
