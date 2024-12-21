import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL || '';

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env');
}

const options: any = {
  maxPoolSize: 10,
  minPoolSize: 5,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
  serverApi: {
    version: '1' as const,
    strict: true,
    deprecationErrors: true,
  }
};

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;