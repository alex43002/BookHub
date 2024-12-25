import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import { Book } from '@/lib/types/book';
import { BookUpdateHistory } from '@/lib/types/reading-session';
import { ErrorBoundary } from '@/components/error-boundary';

interface SessionHistoryProps {
  book: Book;
}

interface SessionEntryProps {
  session: BookUpdateHistory;
}

function SessionEntry({ session }: SessionEntryProps) {
  const pagesRead = session.pagesRead;
  const formattedDate = format(session.date, 'MMM d, yyyy');
  const formattedTime = format(session.date, 'h:mm a');
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {pagesRead} pages read
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {formattedTime}
          </span>
        </div>
      </div>
      <div className="text-sm text-right">
        <div className="font-medium">{formattedDate}</div>
        <div className="text-xs text-muted-foreground">{timezone}</div>
      </div>
    </div>
  );
}

export function SessionHistory({ book }: SessionHistoryProps) {
  const [showAll, setShowAll] = useState(false);
  const { data: sessions, isLoading, error } = trpc.readingSession.list.useQuery(
    { bookId: book.id },
    {
      onSuccess: (data) => {
        console.log('Sessions loaded:', data?.length);
      },
      onError: (err) => {
        console.error('Error loading sessions:', err);
      },
      staleTime: 1000 * 60, // Consider data fresh for 1 minute
      retry: 2, // Retry failed requests twice
    }
  );
  console.log(sessions);
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        <Card>
          <CardContent className="p-6 text-center text-destructive">
            Failed to load reading sessions
          </CardContent>
        </Card>
      </ErrorBoundary>
    );
  }

  if (!sessions?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reading History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No reading sessions recorded yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayedSessions = showAll ? sessions : sessions.slice(0, 5);
  const hasMoreSessions = sessions.length > 5;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Reading History</CardTitle>
          <span className="text-sm text-muted-foreground">
            {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedSessions.map((session) => (
            <SessionEntry key={session.id} session={session} />
          ))}
          {hasMoreSessions && (
            <div className="pt-2 text-center">
              <Button
                variant="ghost"
                onClick={() => setShowAll(!showAll)}
                aria-expanded={showAll}
              >
                {showAll ? 'Show Less' : 'Show More'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}