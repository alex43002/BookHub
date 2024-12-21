import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export interface ReadingSession {
  _id: ObjectId;
  startPage: number;
  endPage: number;
  duration: number;
  date: Date;
  bookId: string;
  userId: string;
}

export async function createSession(userId: string, data: Omit<ReadingSession, '_id' | 'userId'>) {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection<ReadingSession>('readingSessions').insertOne({
    ...data,
    userId
  });

  // Update book's current page and status
  const book = await db.collection('books').findOne({ 
    _id: new ObjectId(data.bookId) 
  });

  if (book) {
    await db.collection('books').updateOne(
      { _id: new ObjectId(data.bookId) },
      { 
        $set: {
          currentPage: data.endPage,
          status: data.endPage === 0 ? 'UNREAD' :
                 data.endPage >= book.totalPages ? 'COMPLETED' : 'READING'
        }
      }
    );
  }

  return {
    id: result.insertedId.toString(),
    ...data,
    userId
  };
}

export async function listSessions(userId: string, bookId?: string) {
  const client = await clientPromise;
  const db = client.db();
  
  const query = bookId 
    ? { userId, bookId }
    : { userId };
    
  return db.collection<ReadingSession>('readingSessions')
    .find(query)
    .sort({ date: -1 })
    .toArray();
}