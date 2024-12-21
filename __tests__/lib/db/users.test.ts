import { MongoClient, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getUserByEmail, getUserById, createUser } from '@/lib/db/users';

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

describe('User Database Operations', () => {
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
  };

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = await createUser(mockUser);
      
      expect(user).toMatchObject({
        name: mockUser.name,
        email: mockUser.email,
      });
      expect(user.id).toBeDefined();
    });

    it('should set creation timestamps', async () => {
      const user = await createUser(mockUser);
      const dbUser = await client.db().collection('users').findOne({ 
        _id: new ObjectId(user.id) 
      });
      
      expect(dbUser?.createdAt).toBeInstanceOf(Date);
      expect(dbUser?.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getUserByEmail', () => {
    it('should retrieve a user by email', async () => {
      await createUser(mockUser);
      const user = await getUserByEmail(mockUser.email);
      
      expect(user).toMatchObject({
        name: mockUser.name,
        email: mockUser.email,
      });
    });

    it('should return null for non-existent email', async () => {
      const user = await getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should retrieve a user by id', async () => {
      const created = await createUser(mockUser);
      const user = await getUserById(created.id);
      
      expect(user).toMatchObject({
        name: mockUser.name,
        email: mockUser.email,
      });
    });

    it('should return null for non-existent id', async () => {
      const user = await getUserById(new ObjectId().toString());
      expect(user).toBeNull();
    });
  });
});