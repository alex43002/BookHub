'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong!</h2>
        <p className="text-muted-foreground mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}