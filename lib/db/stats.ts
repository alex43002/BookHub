import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { startOfMonth } from 'date-fns';

export async function getReadingStats(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  const [completedBooks, currentlyReading, sessions] = await Promise.all([
    db.collection('books').countDocuments({ 
      userId, 
      status: 'COMPLETED' 
    }),
    db.collection('books').countDocuments({ 
      userId, 
      status: 'READING' 
    }),
    db.collection('readingSessions')
      .find({ userId })
      .toArray()
  ]);

  const totalPagesRead = sessions.reduce((sum, session) => 
    sum + (session.endPage - session.startPage), 0);
  
  const totalReadingTime = sessions.reduce((sum, session) => 
    sum + session.duration, 0);

  const averageReadingTime = sessions.length 
    ? Math.round(totalReadingTime / sessions.length)
    : 0;

  return {
    completedBooks,
    currentlyReading,
    totalPagesRead,
    totalReadingTime,
    averageReadingTime
  };
}

export async function getReadingTrends(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const sessions = await db.collection('readingSessions')
    .find({
      userId,
      date: { $gte: sixMonthsAgo }
    })
    .sort({ date: 1 })
    .toArray();

  const monthlyData = sessions.reduce((acc, session) => {
    const month = startOfMonth(session.date).toISOString();
    const pagesRead = session.endPage - session.startPage;
    
    if (!acc[month]) {
      acc[month] = { month, pagesRead: 0 };
    }
    acc[month].pagesRead += pagesRead;
    return acc;
  }, {} as Record<string, { month: string; pagesRead: number }>);

  return Object.values(monthlyData);
}