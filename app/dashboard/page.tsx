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
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Books</h1>
          </div>
          <div className="flex space-x-2">
            <SetGoalDialog>
              <Button variant="outline">
                <Target className="mr-2 h-4 w-4" />
                Set Goal
              </Button>
            </SetGoalDialog>
            <AddBookDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            </AddBookDialog>
          </div>
        </div>
        <div className="space-y-8 mb-8">
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