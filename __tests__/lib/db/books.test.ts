import { MongoClient, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createBook, getBook, updateBook, deleteBook, listBooks } from '@/lib/db/books';

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

describe('Book Database Operations', () => {
  const mockBook = {
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890',
    totalPages: 200,
    currentPage: 0,
    status: 'UNREAD' as const,
  };

  describe('createBook', () => {
    it('should create a new book', async () => {
      const book = await createBook(userId, mockBook);
      
      expect(book).toMatchObject({
        ...mockBook,
        userId,
      });
      expect(book.id).toBeDefined();
    });
  });

  describe('getBook', () => {
    it('should retrieve a book by id', async () => {
      const created = await createBook(userId, mockBook);
      const book = await getBook(created.id, userId);
      
      expect(book).toMatchObject({
        ...mockBook,
        userId,
      });
    });

    it('should return null for non-existent book', async () => {
      const book = await getBook(new ObjectId().toString(), userId);
      expect(book).toBeNull();
    });
  });

  describe('updateBook', () => {
    it('should update book details', async () => {
      const created = await createBook(userId, mockBook);
      const updated = await updateBook(created.id, userId, {
        currentPage: 50,
        status: 'READING',
      });

      expect(updated).toMatchObject({
        ...mockBook,
        currentPage: 50,
        status: 'READING',
      });
    });

    it('should not update book of different user', async () => {
      const created = await createBook(userId, mockBook);
      const otherUserId = new ObjectId().toString();
      const updated = await updateBook(created.id, otherUserId, {
        currentPage: 50,
      });

      expect(updated).toBeNull();
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      const created = await createBook(userId, mockBook);
      const deleted = await deleteBook(created.id, userId);
      
      expect(deleted).toMatchObject(mockBook);
      
      const book = await getBook(created.id, userId);
      expect(book).toBeNull();
    });
  });

  describe('listBooks', () => {
    it('should list all books for a user', async () => {
      await createBook(userId, mockBook);
      await createBook(userId, {
        ...mockBook,
        title: 'Another Book',
      });

      const books = await listBooks(userId);
      expect(books).toHaveLength(2);
      expect(books[0].title).toBeDefined();
    });

    it('should not include books from other users', async () => {
      await createBook(userId, mockBook);
      const otherUserId = new ObjectId().toString();
      await createBook(otherUserId, mockBook);

      const books = await listBooks(userId);
      expect(books).toHaveLength(1);
    });
  });
});