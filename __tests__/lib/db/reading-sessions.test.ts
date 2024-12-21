import { MongoClient, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createSession, listSessions } from '@/lib/db/reading-sessions';

let mongod: MongoMemoryServer;
let client: MongoClient;
const userId = new ObjectId().toString();
const bookId = new ObjectId().toString();

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

describe('Reading Sessions Database Operations', () => {
  const mockSession = {
    bookId,
    startPage: 1,
    endPage: 10,
    duration: 30,
    date: new Date(),
  };

  describe('createSession', () => {
    it('should create a new reading session', async () => {
      // Setup: Create a book first
      await client.db().collection('books').insertOne({
        _id: new ObjectId(bookId),
        userId,
        title: 'Test Book',
        totalPages: 100,
        currentPage: 0,
        status: 'UNREAD',
      });

      const session = await createSession(userId, mockSession);
      
      expect(session).toMatchObject({
        ...mockSession,
        userId,
      });
      expect(session.id).toBeDefined();

      // Verify book status was updated
      const book = await client.db().collection('books').findOne({ _id: new ObjectId(bookId) });
      expect(book).toMatchObject({
        currentPage: mockSession.endPage,
        status: 'READING',
      });
    });

    it('should mark book as completed when reaching total pages', async () => {
      // Setup: Create a book
      await client.db().collection('books').insertOne({
        _id: new ObjectId(bookId),
        userId,
        title: 'Test Book',
        totalPages: 10,
        currentPage: 0,
        status: 'UNREAD',
      });

      await createSession(userId, mockSession);

      const book = await client.db().collection('books').findOne({ _id: new ObjectId(bookId) });
      expect(book?.status).toBe('COMPLETED');
    });
  });

  describe('listSessions', () => {
    beforeEach(async () => {
      await createSession(userId, mockSession);
      await createSession(userId, {
        ...mockSession,
        startPage: 11,
        endPage: 20,
      });
    });

    it('should list all sessions for a user', async () => {
      const sessions = await listSessions(userId);
      expect(sessions).toHaveLength(2);
      expect(sessions[0]).toMatchObject({
        userId,
        bookId,
      });
    });

    it('should filter sessions by book', async () => {
      const sessions = await listSessions(userId, bookId);
      expect(sessions).toHaveLength(2);
      expect(sessions[0].bookId).toBe(bookId);
    });

    it('should not include sessions from other users', async () => {
      const otherUserId = new ObjectId().toString();
      await createSession(otherUserId, mockSession);

      const sessions = await listSessions(userId);
      expect(sessions).toHaveLength(2);
    });
  });
});