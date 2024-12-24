import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { ReadingSession, MongoReadingSession, BookUpdateHistory, MongoBookUpdateHistory } from '@/lib/types/reading-session';
import { recordReadingProgress } from './reading-trends';

function mapMongoSessionToSession(session: MongoReadingSession): ReadingSession {
  return {
    id: session._id.toString(),
    startPage: session.startPage,
    endPage: session.endPage,
    duration: session.duration,
    date: session.date,
    bookId: session.bookId,
    userId: session.userId
  };
}

function mapSessionsToBookUpdateHistory( session: MongoBookUpdateHistory ): BookUpdateHistory {
  return {
    id: session._id,
    bookId: session.bookId,
    userId: session.userId,
    pagesRead: session.pagesRead,
    date: session.date,
  };
}


async function ensureCollectionSetup(db: any) {
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: 'readingTrends' }).toArray();
    if (collections.length === 0) {
      console.log('Creating readingTrends collection');
      await db.createCollection('readingTrends');
    }

    // Ensure indexes
    await db.collection('readingTrends').createIndexes([
      { key: { userId: 1 }, name: 'userId_idx' },
      { key: { bookId: 1 }, name: 'bookId_idx' },
      { key: { date: -1 }, name: 'date_idx' }
    ]);

    console.log('Collection setup complete');
  } catch (error) {
    console.error('Error setting up collection:', error);
  }
}

export async function createSession(userId: string, data: Omit<ReadingSession, 'id' | 'userId'>) {
  const client = await clientPromise;
  const db = client.db();
  
  await ensureCollectionSetup(db);
  
  // Calculate pages read for trends
  const pagesRead = data.endPage - data.startPage;
  
  const result = await db.collection<MongoReadingSession>('readingTrends').insertOne({
    ...data,
    userId,
    _id: new ObjectId().toString()
  });

  // Record reading progress for trends
  if (pagesRead > 0) {
    await recordReadingProgress(userId, data.bookId, pagesRead, data.date);
  }

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

  return mapMongoSessionToSession({
    _id: result.insertedId,
    ...data,
    userId,
  });
}

export async function listSessions(userId: string, bookId?: string) {
  const client = await clientPromise;
  const db = client.db();

  console.log('listSessions Fetching sessions:', { userId, bookId });

  const query = bookId
    ? { userId, bookId }
    : { userId };

  console.log('MongoDB query:', query);

  const sessions = await db.collection<MongoBookUpdateHistory>('readingTrends')
    .find(query)
    .sort({ date: -1 })
    .toArray();

  console.log('Found sessions:', sessions, sessions.length);

  // Map sessions to BookUpdateHistory model
  return sessions.map(mapSessionsToBookUpdateHistory);
}
