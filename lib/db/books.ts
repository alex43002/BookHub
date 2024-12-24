import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { recordReadingProgress } from './reading-trends';
import { TRPCError } from '@trpc/server';
import { Book, MongoBook } from '@/lib/types/book';

function mapMongoBookToBook(book: MongoBook): Book {
  const { _id, ...rest } = book;
  return {
    id: _id.toString(),
    ...rest
  };
}

export async function createBook(userId: string, data: Omit<Book, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();
  
  const result = await db.collection<MongoBook>('books').insertOne({
    ...data,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: new ObjectId
  });

  return mapMongoBookToBook({
    _id: result.insertedId,
    ...data,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function getBook(id: string, userId: string) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();
  const book = await db.collection<MongoBook>('books').findOne({ 
    _id: new ObjectId(id),
    userId 
  });
  
  return book ? mapMongoBookToBook(book) : null;
}

export async function updateBook(id: string, userId: string, data: Partial<Book>) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();
  
  // Get current book state
  const currentBook = await db.collection<MongoBook>('books').findOne({
    _id: new ObjectId(id),
    userId
  });

  if (!currentBook) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Book not found'
    });
  }

  // Validate page updates
  if (typeof data.currentPage === 'number') {
    if (data.currentPage < 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Current page cannot be negative'
      });
    }

    if (data.currentPage > currentBook.totalPages) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Current page cannot exceed total pages'
      });
    }

    // Record reading progress
    const pagesRead = data.currentPage - currentBook.currentPage;
    if (pagesRead > 0) {
      await recordReadingProgress(userId, id, pagesRead);
    }
  }

  const updatedBook = await db.collection<MongoBook>('books').findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { 
      $set: {
        ...data,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );

  return updatedBook ? mapMongoBookToBook(updatedBook) : null;
}

export async function deleteBook(id: string, userId: string) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();
  
  const deletedBook = await db.collection<MongoBook>('books').findOneAndDelete({
    _id: new ObjectId(id),
    userId
  });

  return deletedBook ? mapMongoBookToBook(deletedBook) : null;
}

export async function listBooks(userId: string) {
  const client = await clientPromise;
  if (!client) return [];

  const db = client.db();
  
  const books = await db.collection<MongoBook>('books')
    .find({ userId })
    .sort({ updatedAt: -1 })
    .toArray();
    
  return books.map(mapMongoBookToBook);
}