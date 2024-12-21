import { useState } from 'react';
import { Book, BookStatus } from '@/lib/types/book';
import { sortOptions } from '@/lib/utils/sorting';

export function useBookFilters(books: Book[] | undefined) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | BookStatus>('ALL');
  const [sort, setSort] = useState('updated');

  const filteredBooks = books?.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
                         book.author.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'ALL' || book.status === status;
    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  const currentSort = sortOptions.find((option) => option.value === sort);
  const sortedBooks = currentSort && filteredBooks 
    ? [...filteredBooks].sort(currentSort.compareFn)
    : filteredBooks;

  return {
    search,
    setSearch,
    status,
    setStatus,
    sort,
    setSort,
    filteredBooks: sortedBooks,
  };
}