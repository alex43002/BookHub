import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();
  return db.collection<User>('users').findOne({ email });
}

export async function getUserById(id: string) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();
  return db.collection<User>('users').findOne({ _id: new ObjectId(id) });
}

export async function createUser(data: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
  const client = await clientPromise;
  if (!client) return null;

  const db = client.db();
  
  const result = await db.collection<User>('users').insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id: result.insertedId.toString(),
    ...data,
  };
}