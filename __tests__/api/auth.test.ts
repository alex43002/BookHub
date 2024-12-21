import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/auth/signup/route';
import { hash } from 'bcryptjs';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;
let client: MongoClient;

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

describe('Auth API', () => {
  describe('POST /api/auth/signup', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: mockUser,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.user).toMatchObject({
        name: mockUser.name,
        email: mockUser.email,
      });
      expect(data.user.password).toBeUndefined();
    });

    it('should return 400 for existing user', async () => {
      // Create user first
      const hashedPassword = await hash(mockUser.password, 10);
      await client.db().collection('users').insertOne({
        ...mockUser,
        password: hashedPassword,
      });

      const { req } = createMocks({
        method: 'POST',
        body: mockUser,
      });

      const response = await POST(req);
      expect(response.status).toBe(400);
    });

    it('should validate input data', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          name: 'a', // too short
          email: 'invalid-email',
          password: '12345', // too short
        },
      });

      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });
});