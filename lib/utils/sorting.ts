import { Book } from '@/lib/types/book';

export type SortOption = {
  label: string;
  value: string;
  compareFn: (a: Book, b: Book) => number;
};

export const sortOptions: SortOption[] = [
  {
    label: 'Recently Updated',
    value: 'updated',
    compareFn: (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  },
  {
    label: 'Title (A-Z)',
    value: 'title-asc',
    compareFn: (a, b) => a.title.localeCompare(b.title),
  },
  {
    label: 'Title (Z-A)',
    value: 'title-desc',
    compareFn: (a, b) => b.title.localeCompare(a.title),
  },
  {
    label: 'Progress',
    value: 'progress',
    compareFn: (a, b) => (b.currentPage / b.totalPages) - (a.currentPage / a.totalPages),
  },
];