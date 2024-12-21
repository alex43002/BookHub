'use client';

import { trpc } from '@/lib/trpc/client';
import { BookCard } from './book-card';

export function BookList() {
  const { data: books, isLoading } = trpc.book.list.useQuery();

  if (isLoading) {
    return <div>Loading books...</div>;
  }

  if (!books?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No books added yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}