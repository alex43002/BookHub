import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export interface Book {
  _id: ObjectId;
  title: string;
  author: string;
  isbn?: string;
  coverImage?: string;
  totalPages: number;
  currentPage: number;
  status: 'UNREAD' | 'READING' | 'COMPLETED';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
import { Book, MongoBook } from '@/lib/types/book';

function mapMongoBookToBook(book: MongoBook): Book {
  const { _id, ...rest } = book;
  return {
    id: _id.toString(),
    ...rest
  };
}

export async function createBook(userId: string, data: Omit<Book, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();
  
  const result = await db.collection<MongoBook>('books').insertOne({
    ...data,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return mapMongoBookToBook({
    _id: result.insertedId,
    id: result.insertedId.toString(),
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
  
  const result = await db.collection<MongoBook>('books').findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { 
      $set: {
        ...data,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );

  return result.value ? mapMongoBookToBook(result.value) : null;
}

export async function deleteBook(id: string, userId: string) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();
  
  const result = await db.collection<MongoBook>('books').findOneAndDelete({
    _id: new ObjectId(id),
    userId
  });

  return result.value ? mapMongoBookToBook(result.value) : null;
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