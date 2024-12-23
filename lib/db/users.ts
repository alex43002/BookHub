import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export interface MongoUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string | null;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string | null;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

function mapMongoUserToUser(user: MongoUser): User {
  const { _id, ...rest } = user;
  return {
    id: _id.toString(),
    ...rest
  };
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();
  const user = await db.collection<MongoUser>('users').findOne({ email });
  return user ? mapMongoUserToUser(user) : null;
}

export async function getUserById(id: string) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();
  const user = await db.collection<MongoUser>('users').findOne({ 
    _id: new ObjectId(id) 
  });
  return user ? mapMongoUserToUser(user) : null;
}

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();

  // Insert the user data into the collection
  const result = await db.collection<MongoUser>('users').insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: new ObjectId
  });

  // Map the inserted user to the User type
  return mapMongoUserToUser({
    _id: result.insertedId, // Add _id after insertion
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
