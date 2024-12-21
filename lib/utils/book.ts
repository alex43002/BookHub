import { Book } from '@/lib/types/book';

export type BookStatus = 'UNREAD' | 'READING' | 'COMPLETED';

export function getBookProgress(book: Book): number {
  return Math.round((book.currentPage / book.totalPages) * 100);
}

export function getBookStatus(currentPage: number, totalPages: number): BookStatus {
  if (currentPage === 0) return 'UNREAD';
  if (currentPage >= totalPages) return 'COMPLETED';
  return 'READING';
}

export function formatBookStatus(status: BookStatus): string {
  return {
    UNREAD: 'Not Started',
    READING: 'In Progress',
    COMPLETED: 'Completed'
  }[status];
}