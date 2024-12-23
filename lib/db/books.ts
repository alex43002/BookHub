import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { Book, MongoBook } from '@/lib/types/book';

function mapMongoBookToBook(book: MongoBook): Book {
  const { _id, ...rest } = book;
  return {
    id: _id.toString(),
    ...rest,
  };
}

export async function createBook(
  userId: string,
  data: Omit<Book, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) {
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
    updatedAt: new Date(),
  });
}

export async function getBook(id: string, userId: string) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();
  const book = await db.collection<MongoBook>('books').findOne({
    _id: new ObjectId(id),
    userId,
  });

  return book ? mapMongoBookToBook(book) : null;
}

export async function updateBook(
  id: string,
  userId: string,
  data: Partial<Book>
) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();

  // Update book and return the updated document or null if not found
  const updatedBook = await db.collection<MongoBook>('books').findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' } // Ensures the updated document is returned
  );

  if (!updatedBook) {
    console.warn(`No book found with id ${id} for user ${userId}`);
    return null;
  }

  return mapMongoBookToBook(updatedBook);
}

export async function deleteBook(id: string, userId: string) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();

  // Delete book and return the deleted document or null if not found
  const deletedBook = await db.collection<MongoBook>('books').findOneAndDelete({
    _id: new ObjectId(id),
    userId,
  });

  if (!deletedBook) {
    console.warn(`No book found to delete with id ${id} for user ${userId}`);
    return null;
  }

  return mapMongoBookToBook(deletedBook);
}

export async function listBooks(userId: string) {
  const client = await clientPromise;
  if (!client) return [];

  const db = client.db();

  const books = await db
    .collection<MongoBook>('books')
    .find({ userId })
    .sort({ updatedAt: -1 })
    .toArray();

  return books.map(mapMongoBookToBook);
}
