'use client';

import { BookCard } from './book-card';
import { BookFilters } from './book-filters';
import { trpc } from '@/lib/trpc/client';
import { useBookFilters } from '@/hooks/use-book-filters';

export function BookList() {
  const { data: books, isLoading } = trpc.book.list.useQuery();
  const {
    search,
    setSearch,
    status,
    setStatus,
    sort,
    setSort,
    filteredBooks
  } = useBookFilters(books);

  if (isLoading) {
    return <div>Loading books...</div>;
  }

  if (!filteredBooks?.length) {
    return (
      <>
        <BookFilters
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSortChange={setSort}
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {books?.length ? 'No books match your filters.' : 'No books added yet.'}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <BookFilters
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </>
  );
}