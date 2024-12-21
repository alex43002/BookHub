import { prisma } from '@/lib/prisma';
import type { Book } from '@prisma/client';
import type { BookFormData } from '@/lib/validators/book';

export class BookService {
  async createBook(userId: string, data: BookFormData): Promise<Book> {
    return prisma.book.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getBook(id: string, userId: string): Promise<Book | null> {
    return prisma.book.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async updateBook(
    id: string,
    userId: string,
    data: Partial<BookFormData>
  ): Promise<Book | null> {
    return prisma.book.update({
      where: {
        id,
        userId,
      },
      data,
    });
  }

  async deleteBook(id: string, userId: string): Promise<Book | null> {
    return prisma.book.delete({
      where: {
        id,
        userId,
      },
    });
  }

  async listBooks(userId: string): Promise<Book[]> {
    return prisma.book.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
}