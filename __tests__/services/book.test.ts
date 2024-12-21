import { describe, expect, it, beforeEach } from '@jest/globals';
import { BookService } from '@/lib/services/book';
import { prisma } from '@/lib/prisma';
import { Book } from '@prisma/client';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('BookService', () => {
  let bookService: BookService;
  const mockUserId = 'user123';
  const mockBookId = 'book123';
  
  const mockBook: Book = {
    id: mockBookId,
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890',
    coverImage: 'https://example.com/cover.jpg',
    totalPages: 200,
    currentPage: 0,
    status: 'UNREAD',
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    bookService = new BookService();
    jest.clearAllMocks();
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      (prisma.book.create as jest.Mock).mockResolvedValue(mockBook);

      const result = await bookService.createBook(mockUserId, {
        title: mockBook.title,
        author: mockBook.author,
        isbn: mockBook.isbn,
        coverImage: mockBook.coverImage,
        totalPages: mockBook.totalPages,
        currentPage: mockBook.currentPage,
        status: 'UNREAD',
      });

      expect(result).toEqual(mockBook);
      expect(prisma.book.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUserId,
          title: mockBook.title,
        }),
      });
    });
  });

  describe('getBook', () => {
    it('should return a book by id and userId', async () => {
      (prisma.book.findFirst as jest.Mock).mockResolvedValue(mockBook);

      const result = await bookService.getBook(mockBookId, mockUserId);

      expect(result).toEqual(mockBook);
      expect(prisma.book.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockBookId,
          userId: mockUserId,
        },
      });
    });

    it('should return null if book not found', async () => {
      (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await bookService.getBook(mockBookId, mockUserId);

      expect(result).toBeNull();
    });
  });

  describe('updateBook', () => {
    it('should update a book', async () => {
      const updatedBook = { ...mockBook, currentPage: 50 };
      (prisma.book.update as jest.Mock).mockResolvedValue(updatedBook);

      const result = await bookService.updateBook(
        mockBookId,
        mockUserId,
        { currentPage: 50 }
      );

      expect(result).toEqual(updatedBook);
      expect(prisma.book.update).toHaveBeenCalledWith({
        where: {
          id: mockBookId,
          userId: mockUserId,
        },
        data: { currentPage: 50 },
      });
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      (prisma.book.delete as jest.Mock).mockResolvedValue(mockBook);

      const result = await bookService.deleteBook(mockBookId, mockUserId);

      expect(result).toEqual(mockBook);
      expect(prisma.book.delete).toHaveBeenCalledWith({
        where: {
          id: mockBookId,
          userId: mockUserId,
        },
      });
    });
  });

  describe('listBooks', () => {
    it('should return all books for a user', async () => {
      const mockBooks = [mockBook];
      (prisma.book.findMany as jest.Mock).mockResolvedValue(mockBooks);

      const result = await bookService.listBooks(mockUserId);

      expect(result).toEqual(mockBooks);
      expect(prisma.book.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    });
  });
});