import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export interface ReadingGoal {
  _id: ObjectId;
  type: 'BOOKS_PER_YEAR' | 'PAGES_PER_DAY' | 'MINUTES_PER_DAY';
  target: number;
  progress: number;
  startDate: Date;
  endDate: Date;
  userId: string;
}

export async function createGoal(userId: string, data: Omit<ReadingGoal, '_id' | 'userId' | 'progress'>) {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection<ReadingGoal>('readingGoals').insertOne({
    ...data,
    userId,
    progress: 0
  });

  return {
    id: result.insertedId.toString(),
    ...data,
    userId,
    progress: 0
  };
}

export async function getCurrentGoal(userId: string) {
  const client = await clientPromise;
  const db = client.db();
  
  return db.collection<ReadingGoal>('readingGoals').findOne({
    userId,
    endDate: { $gte: new Date() }
  }, {
    sort: { startDate: -1 }
  });
}

export async function updateGoalProgress(id: string, userId: string, progress: number) {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection<ReadingGoal>('readingGoals').findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: { progress } },
    { returnDocument: 'after' }
  );

  return result.value;
}