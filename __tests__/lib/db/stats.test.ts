import { MongoClient, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getReadingStats, getReadingTrends } from '@/lib/db/stats';

let mongod: MongoMemoryServer;
let client: MongoClient;
const userId = new ObjectId().toString();

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  client = await MongoClient.connect(uri);
  global._mongoClientPromise = Promise.resolve(client);
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});

beforeEach(async () => {
  const collections = await client.db().collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

describe('Reading Stats Operations', () => {
  beforeEach(async () => {
    // Setup test data
    const db = client.db();
    
    // Add some books
    await db.collection('books').insertMany([
      {
        _id: new ObjectId(),
        userId,
        title: 'Completed Book',
        status: 'COMPLETED',
      },
      {
        _id: new ObjectId(),
        userId,
        title: 'Reading Book',
        status: 'READING',
      },
    ]);

    // Add reading sessions
    const now = new Date();
    await db.collection('readingSessions').insertMany([
      {
        userId,
        startPage: 1,
        endPage: 10,
        duration: 30,
        date: now,
      },
      {
        userId,
        startPage: 11,
        endPage: 20,
        duration: 45,
        date: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
      },
    ]);
  });

  describe('getReadingStats', () => {
    it('should return correct reading statistics', async () => {
      const stats = await getReadingStats(userId);

      expect(stats).toMatchObject({
        completedBooks: 1,
        currentlyReading: 1,
        totalPagesRead: 18, // (10-1) + (20-11)
        totalReadingTime: 75, // 30 + 45
        averageReadingTime: 38, // 75/2 rounded
      });
    });

    it('should return zero stats for new user', async () => {
      const newUserId = new ObjectId().toString();
      const stats = await getReadingStats(newUserId);

      expect(stats).toMatchObject({
        completedBooks: 0,
        currentlyReading: 0,
        totalPagesRead: 0,
        totalReadingTime: 0,
        averageReadingTime: 0,
      });
    });
  });

  describe('getReadingTrends', () => {
    it('should return monthly reading trends', async () => {
      const trends = await getReadingTrends(userId);

      expect(trends).toHaveLength(1); // Both sessions are in the same month
      expect(trends[0]).toHaveProperty('pagesRead', 18);
      expect(trends[0]).toHaveProperty('month');
    });

    it('should only include last 6 months', async () => {
      const db = client.db();
      const sevenMonthsAgo = new Date();
      sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

      await db.collection('readingSessions').insertOne({
        userId,
        startPage: 1,
        endPage: 10,
        duration: 30,
        date: sevenMonthsAgo,
      });

      const trends = await getReadingTrends(userId);
      const oldestDate = new Date(trends[0].month);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      expect(oldestDate.getTime()).toBeGreaterThan(sixMonthsAgo.getTime());
    });
  });
});