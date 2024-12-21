import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export async function getOverview(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  const [totalReadingTime, averagePagesPerHour] = await Promise.all([
    db.collection('readingSessions')
      .aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$duration' } } }
      ])
      .toArray(),
    db.collection('readingSessions')
      .aggregate([
        { $match: { userId } },
        { 
          $project: {
            pagesPerHour: {
              $multiply: [
                { $divide: [{ $subtract: ['$endPage', '$startPage'] }, '$duration'] },
                60
              ]
            }
          }
        },
        { $group: { _id: null, average: { $avg: '$pagesPerHour' } } }
      ])
      .toArray()
  ]);

  return {
    totalReadingTime: totalReadingTime[0]?.total || 0,
    averagePagesPerHour: Math.round(averagePagesPerHour[0]?.average || 0)
  };
}

export async function getDailySessions(userId: string, date = new Date()) {
  const client = await clientPromise;
  const db = client.db();

  const sessions = await db.collection('readingSessions')
    .aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: startOfDay(date),
            $lte: endOfDay(date)
          }
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book'
        }
      },
      {
        $project: {
          bookTitle: { $arrayElemAt: ['$book.title', 0] },
          duration: 1,
          date: 1
        }
      }
    ])
    .toArray();

  return sessions;
}

export async function getReadingHeatmap(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  const sessions = await db.collection('readingSessions')
    .find({
      userId,
      date: { $gte: subDays(new Date(), 30) }
    })
    .toArray();

  const heatmap = Array(7).fill(0).map((_, day) =>
    Array(24).fill(0).map((_, hour) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
      hour: hour.toString(),
      value: sessions.filter(s => 
        s.date.getDay() === day && 
        s.date.getHours() === hour
      ).reduce((sum, s) => sum + s.duration, 0)
    }))
  ).flat();

  return heatmap;
}

export async function getReadingPace(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  const pace = await db.collection('readingSessions')
    .aggregate([
      { $match: { userId } },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          pagesPerHour: {
            $multiply: [
              { $divide: [{ $subtract: ['$endPage', '$startPage'] }, '$duration'] },
              60
            ]
          }
        }
      },
      {
        $group: {
          _id: '$date',
          pagesPerHour: { $avg: '$pagesPerHour' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          pagesPerHour: { $round: ['$pagesPerHour', 1] }
        }
      }
    ])
    .toArray();

  return pace;
}

export async function getGenreDistribution(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  const genres = await db.collection('books')
    .aggregate([
      { $match: { userId } },
      { $group: { _id: '$genre', value: { $sum: 1 } } },
      { 
        $project: {
          id: '$_id',
          label: '$_id',
          value: 1
        }
      }
    ])
    .toArray();

  return genres;
}