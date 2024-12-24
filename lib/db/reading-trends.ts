import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export interface ReadingTrendEntry {
  userId: string;
  bookId: string;
  pagesRead: number;
  date: Date;
}

export async function recordReadingProgress(
  userId: string,
  bookId: string,
  pagesRead: number,
  date = new Date()
) {
  const client = await clientPromise;
  const db = client.db();

  await db.collection('readingTrends').insertOne({
    userId,
    bookId,
    pagesRead,
    date,
  });
}