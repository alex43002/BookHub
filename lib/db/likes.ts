import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export async function toggleLike(userId: string, shareId: string) {
  const client = await clientPromise;
  const db = client.db();

  const like = await db.collection('likes').findOne({
    userId,
    shareId: new ObjectId(shareId)
  });

  if (like) {
    await db.collection('likes').deleteOne({
      userId,
      shareId: new ObjectId(shareId)
    });
    return false;
  } else {
    await db.collection('likes').insertOne({
      userId,
      shareId: new ObjectId(shareId),
      createdAt: new Date()
    });
    return true;
  }
}