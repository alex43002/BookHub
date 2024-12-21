import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from '@/components/providers/session-provider';
import { TRPCProvider } from '@/lib/trpc/provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookTracker - Track Your Reading Journey',
  description: 'Track your reading progress, discover new books, and connect with fellow readers.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <TRPCProvider>
            <Header />
            {children}
            <Toaster />
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
