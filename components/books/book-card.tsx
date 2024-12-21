'use client';

import { Book } from '@prisma/client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import { EditBookDialog } from './edit-book-dialog';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const utils = trpc.useContext();
  const deleteBook = trpc.book.delete.useMutation({
    onSuccess: () => {
      utils.book.list.invalidate();
    },
  });

  const progress = Math.round((book.currentPage / book.totalPages) * 100);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {book.coverImage && (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg">{book.title}</h3>
            <p className="text-muted-foreground">{book.author}</p>
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
    </Card>
  );
}