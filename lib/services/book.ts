import * as bookDb from '@/lib/db/books';
import type { Book } from '@/lib/types/book';
import type { BookFormData } from '@/lib/validators/book';

export class BookService {
  async createBook(userId: string, data: BookFormData): Promise<Book | null> {
    return bookDb.createBook(userId, data);
  }

  async getBook(id: string, userId: string): Promise<Book | null> {
    return bookDb.getBook(id, userId);
  }

  async updateBook(
    id: string,
    userId: string,
    data: Partial<BookFormData>
  ): Promise<Book | null> {
    return bookDb.updateBook(id, userId, data);
  }

  async deleteBook(id: string, userId: string): Promise<Book | null> {
    return bookDb.deleteBook(id, userId);
  }

  async listBooks(userId: string): Promise<Book[]> {
    return bookDb.listBooks(userId);
  }
}