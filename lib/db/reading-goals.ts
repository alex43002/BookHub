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
    progress: 0,
    _id: new ObjectId
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

  // Perform the update operation
  const result = await db.collection<ReadingGoal>('readingGoals').updateOne(
    { _id: new ObjectId(id), userId }, // Query filter
    { $set: { progress } } // Update the progress field
  );

  // Check if the update operation was successful
  if (result.modifiedCount === 0) {
    return null;
  }

  // Fetch the updated document
  const updatedGoal = await db.collection<ReadingGoal>('readingGoals').findOne({
    _id: new ObjectId(id),
    userId,
  });

  if (!updatedGoal) {
    return null;
  }

  // Convert ObjectId to string and return the updated goal
  return {
    id: updatedGoal._id.toString(),
    ...updatedGoal,
  };
}
