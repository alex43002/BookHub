import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import type { ChallengeFormData } from '@/lib/validators/challenge';

export interface Challenge extends ChallengeFormData {
  _id: ObjectId;
  userId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
}

export async function createChallenge(userId: string, data: ChallengeFormData) {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection<Challenge>('challenges').insertOne({
    ...data,
    userId,
    progress: 0,
    completed: false,
    completedAt: new Date(),
    _id: new ObjectId
  });

  return {
    id: result.insertedId.toString(),
    ...data,
    userId,
    progress: 0,
    completed: false,
  };
}

export async function getActiveChallenges(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  return db.collection<Challenge>('challenges')
    .find({
      userId,
      completed: false,
      endDate: { $gte: new Date() }
    })
    .toArray();
}

export async function getCompletedChallenges(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  return db.collection<Challenge>('challenges')
    .find({
      userId,
      completed: true
    })
    .sort({ completedAt: -1 })
    .toArray();
}

export async function updateChallengeProgress(
  id: string,
  userId: string,
  progress: number
) {
  const client = await clientPromise;
  const db = client.db();

  // Find the challenge to ensure it exists
  const challenge = await db.collection<Challenge>('challenges').findOne({
    _id: new ObjectId(id),
    userId,
  });

  if (!challenge) {
    return null;
  }

  // Determine if the challenge is completed and set the completion timestamp
  const completed = progress >= challenge.target;
  const completedAt = completed && !challenge.completed ? new Date() : challenge.completedAt;

  // Perform the update operation
  const result = await db.collection<Challenge>('challenges').updateOne(
    { _id: new ObjectId(id), userId },
    {
      $set: {
        progress,
        completed,
        completedAt,
        updatedAt: new Date(),
      },
    }
  );

  // Check if the update was successful
  if (result.modifiedCount === 0) {
    return null;
  }

  // Fetch the updated document after the update
  const updatedChallenge = await db.collection<Challenge>('challenges').findOne({
    _id: new ObjectId(id),
    userId,
  });

  if (!updatedChallenge) {
    return null;
  }

  // Convert ObjectId to string and return the updated challenge
  return {
    id: updatedChallenge._id.toString(),
    ...updatedChallenge,
  };
}
