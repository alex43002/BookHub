import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export interface Comment {
  _id: ObjectId;
  shareId: ObjectId;
  userId: string;
  text: string;
  createdAt: Date;
}

export async function addComment(userId: string, shareId: string, text: string) {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection<Comment>('comments').insertOne({
    shareId: new ObjectId(shareId),
    userId,
    text,
    createdAt: new Date()
  });

  return {
    id: result.insertedId.toString(),
    shareId,
    userId,
    text,
    createdAt: new Date()
  };
}

export async function getComments(shareId: string) {
  const client = await clientPromise;
  const db = client.db();

  return db.collection<Comment>('comments')
    .aggregate([
      { 
        $match: { 
          shareId: new ObjectId(shareId) 
        } 
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $sort: { createdAt: -1 }
      }
    ])
    .toArray();
}