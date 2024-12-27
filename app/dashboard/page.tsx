'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { ErrorBoundary } from '@/components/error-boundary';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
import { BookList } from '@/components/books/book-list';
import { AddBookDialog } from '@/components/books/add-book-dialog';
import { SetGoalDialog } from '@/components/goals/set-goal-dialog';
import { GoalProgress } from '@/components/goals/goal-progress';
import { ReadingStats } from '@/components/stats/reading-stats';
import { ReadingTrends } from '@/components/stats/reading-trends';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div className="w-full sm:w-auto">
            <h1 className="text-3xl font-bold">My Books</h1>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <SetGoalDialog>
              <Button variant="outline" className="flex-1 sm:flex-none justify-center">
                <Target className="mr-2 h-4 w-4" />
                Set Goal
              </Button>
            </SetGoalDialog>
            <AddBookDialog>
              <Button className="flex-1 sm:flex-none justify-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            </AddBookDialog>
          </div>
        </div>
        <div className="space-y-4 sm:space-y-8 mb-6 sm:mb-8">
          <ErrorBoundary>
            <GoalProgress />
          </ErrorBoundary>
          <ErrorBoundary>
            <ReadingStats />
          </ErrorBoundary>
          <ErrorBoundary>
            <ReadingTrends />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          <BookList />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}