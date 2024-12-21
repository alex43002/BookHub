import { MongoClient, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createGoal, getCurrentGoal, updateGoalProgress } from '@/lib/db/reading-goals';

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

describe('Reading Goals Database Operations', () => {
  const mockGoal = {
    type: 'BOOKS_PER_YEAR' as const,
    target: 12,
    startDate: new Date(),
    endDate: new Date(new Date().getFullYear(), 11, 31),
  };

  describe('createGoal', () => {
    it('should create a new reading goal', async () => {
      const goal = await createGoal(userId, mockGoal);
      
      expect(goal).toMatchObject({
        ...mockGoal,
        userId,
        progress: 0,
      });
      expect(goal.id).toBeDefined();
    });
  });

  describe('getCurrentGoal', () => {
    it('should get the current active goal', async () => {
      await createGoal(userId, mockGoal);
      const current = await getCurrentGoal(userId);
      
      expect(current).toMatchObject({
        ...mockGoal,
        userId,
        progress: 0,
      });
    });

    it('should not return expired goals', async () => {
      const pastGoal = {
        ...mockGoal,
        startDate: new Date(2023, 0, 1),
        endDate: new Date(2023, 11, 31),
      };
      await createGoal(userId, pastGoal);
      
      const current = await getCurrentGoal(userId);
      expect(current).toBeNull();
    });
  });

  describe('updateGoalProgress', () => {
    it('should update goal progress', async () => {
      const created = await createGoal(userId, mockGoal);
      const updated = await updateGoalProgress(created.id, userId, 5);
      
      expect(updated).toMatchObject({
        ...mockGoal,
        progress: 5,
      });
    });

    it('should not update progress for other users', async () => {
      const created = await createGoal(userId, mockGoal);
      const otherUserId = new ObjectId().toString();
      const updated = await updateGoalProgress(created.id, otherUserId, 5);
      
      expect(updated).toBeNull();
    });
  });
});