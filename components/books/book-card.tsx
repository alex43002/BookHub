'use client';

import { Book } from '@/lib/types/book';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, BookOpen } from 'lucide-react';
import { useBookMutations } from '@/hooks/use-book-mutations';
import { useState } from 'react';
import { EditBookDialog } from './edit-book-dialog';
import { ReadingSessionDialog } from './reading-session-dialog';
import { SessionHistory } from './session-history';
import Image from 'next/image';
import { BookStatusBadge } from './book-status';
import { getBookProgress } from '@/lib/utils/book';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteBook } = useBookMutations();

  const progress = getBookProgress(book);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {book.coverImage && (
            <Image
              src={book.coverImage}
              alt={book.title}
              width={400}
              height={600}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg">{book.title}</h3>
            <p className="text-muted-foreground">{book.author}</p>
            <BookStatusBadge status={book.status} className="mt-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        <ReadingSessionDialog book={book}>
          <div>
            <Button variant="outline" size="icon">
              <BookOpen className="h-4 w-4" />
            </Button>
          </div>
        </ReadingSessionDialog>
        <EditBookDialog book={book}>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </EditBookDialog>
        <Button
          variant="outline"
          size="icon"
          onClick={() => deleteBook.mutate(book.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
      <CardContent className="pt-4">
        <SessionHistory book={book} />
      </CardContent>
    </Card>
  );
}