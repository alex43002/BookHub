'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc/client';
import { formatDistanceToNow } from 'date-fns';
import { Book, Clock, BookOpen } from 'lucide-react';
import type { Book as BookType } from '@prisma/client';

interface SessionHistoryProps {
  book: BookType;
}

export function SessionHistory({ book }: SessionHistoryProps) {
  const { data: sessions, isLoading } = trpc.readingSession.list.useQuery({
    bookId: book.id,
  });

  if (isLoading) {
    return <div>Loading sessions...</div>;
  }

  if (!sessions?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reading History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No reading sessions recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reading History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between border-b pb-2 last:border-0"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Pages {session.startPage} - {session.endPage}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{session.duration} minutes</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(session.date, { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}