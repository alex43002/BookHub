import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export interface Notification {
  _id: ObjectId;
  userId: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'GOAL_ACHIEVED' | 'READING_REMINDER';
  data: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export async function createNotification(userId: string, type: Notification['type'], data: Record<string, any>) {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection<Notification>('notifications').insertOne({
    userId,
    type,
    data,
    read: false,
    createdAt: new Date(),
    _id: new ObjectId
  });

  return {
    id: result.insertedId.toString(),
    userId,
    type,
    data,
    read: false,
    createdAt: new Date(),
  };
}

export async function markNotificationAsRead(id: string, userId: string) {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection<Notification>('notifications').findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: { read: true } },
    { returnDocument: 'after' }
  );
  // Return the document from the `result` instead of accessing `value`
  return result;
}


export async function getUnreadNotifications(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  return db.collection<Notification>('notifications')
    .find({ userId, read: false })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getNotifications(userId: string, limit = 20, cursor?: string) {
  const client = await clientPromise;
  const db = client.db();

  const query = cursor 
    ? { userId, _id: { $lt: new ObjectId(cursor) } }
    : { userId };

  const notifications = await db.collection<Notification>('notifications')
    .find(query)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .toArray();

  const hasMore = notifications.length > limit;
  const items = notifications.slice(0, limit);

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1]._id.toString() : undefined
  };
}