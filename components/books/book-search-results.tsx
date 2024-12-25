'use client';

import { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import { type SearchResult } from '@/lib/types/search';
import { type BookFormData } from '@/lib/validators/book';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface BookSearchResultsProps {
  query: string;
}

export function BookSearchResults({ query }: BookSearchResultsProps) {
  const { data: books, isLoading } = trpc.book.search.useQuery({ query });
  const { toast } = useToast();
  const utils = trpc.useContext();
  
  const addBook = trpc.book.create.useMutation({
    onSuccess: () => {
      utils.book.list.invalidate();
      toast({
        title: 'Book added',
        description: 'The book has been added to your library',
      });
    },
  });

  const handleAddBook = useCallback((searchResult: SearchResult) => {
    const bookData: BookFormData = {
      title: searchResult.title,
      author: searchResult.author,
      isbn: searchResult.isbn,
      coverImage: searchResult.coverImage,
      totalPages: searchResult.totalPages,
      currentPage: 0,
      status: 'UNREAD'
    };

    addBook.mutate(bookData, {
      onError: (error) => {
        toast({
          title: 'Error adding book',
          description: error.message,
          variant: 'destructive'
        });
      }
    });
  }, [addBook, toast]);

  if (isLoading) {
    return <div>Searching books...</div>;
  }

  if (!books?.length) {
    return <div>No books found</div>;
  }

  return (
    <div className="grid gap-4">
      {books.map((book: { title: string; author: string; totalPages: number; id: string; description?: string | undefined; isbn?: string | undefined; coverImage?: string | undefined; }) => (
        <Card key={book.id}>
          <CardContent className="flex items-center p-4">
            {book.coverImage && (
              <Image
                src={book.coverImage}
                alt={book.title}
                width={80}
                height={112}
                className="w-20 h-28 object-cover rounded mr-4"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-muted-foreground">{book.author}</p>
              {book.description && (
                <p className="text-sm mt-2 line-clamp-2">{book.description}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleAddBook(book)}
              disabled={addBook.isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}