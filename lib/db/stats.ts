import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { startOfMonth } from 'date-fns';

export async function getReadingStats(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  // Calculate stats from books collection
  const books = await db.collection('books').aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        completedBooks: {
          $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
        },
        currentlyReading: {
          $sum: { $cond: [{ $eq: ['$status', 'READING'] }, 1, 0] }
        },
        totalPagesRead: {
          $sum: '$currentPage'
        }
      }
    }
  ]).toArray();

  const stats = books[0] || {
    completedBooks: 0,
    currentlyReading: 0,
    totalPagesRead: 0
  };

  // For now, estimate reading time based on pages read
  // Assuming average reading speed of 2 minutes per page
  const estimatedTimePerPage = 2;
  const totalReadingTime = stats.totalPagesRead * estimatedTimePerPage;

  return {
    completedBooks: stats.completedBooks,
    currentlyReading: stats.currentlyReading,
    totalPagesRead: stats.totalPagesRead,
    totalReadingTime,
    averageReadingTime: stats.completedBooks > 0 
      ? Math.round(totalReadingTime / stats.completedBooks)
      : 0
  };
}

export async function getReadingTrends(userId: string, timeUnit: 'month' | 'day') {
  const client = await clientPromise;
  const db = client.db();
  
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const dateFormat = timeUnit === 'month' ? '%Y-%m-01' : '%Y-%m-%d';
  
  // Get reading progress from reading trends
  const trends = await db.collection('readingTrends').aggregate([
    { 
      $match: { 
        userId,
        date: { $gte: sixMonthsAgo }
      } 
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormat,
            date: '$date'
          }
        },
        pagesRead: { $sum: '$pagesRead' }
      }
    },
    {
      $project: { 
        _id: 0,
        month: '$_id',
        pagesRead: 1
      }
    },
    { $sort: { month: 1 } }
  ]).toArray();

  return trends.map(({ month, pagesRead }) => ({
    month,
    pagesRead
  }));
}