import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import type { ProfileFormData } from '@/lib/validators/profile';

export interface Profile extends ProfileFormData {
  _id: ObjectId;
  userId: string;
}

export async function getProfile(userId: string) {
  const client = await clientPromise;
  const db = client.db();
  
  return db.collection<Profile>('profiles').findOne({ userId });
}

export async function updateProfile(userId: string, data: ProfileFormData) {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection<Profile>('profiles').findOneAndUpdate(
    { userId },
    { 
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    },
    { 
      upsert: true,
      returnDocument: 'after',
    }
  );

  return result;
}