'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

interface SessionProviderProps {
  children: React.ReactNode;
  session?: any; // Adjust type if using TypeScript with specific session types
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  // Log session for debugging purposes
  console.log('SessionProvider initialized with session:', session);

  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
