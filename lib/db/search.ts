import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export async function searchUsers(query: string, currentUserId: string) {
  const client = await clientPromise;
  const db = client.db();

  return db.collection('users')
    .find({
      _id: { $ne: new ObjectId(currentUserId) },
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
    .limit(10)
    .toArray();
}

export async function searchBooks(query: string, userId: string) {
  const client = await clientPromise;
  const db = client.db();

  return db.collection('books')
    .find({
      userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ]
    })
    .limit(10)
    .toArray();
}

export async function searchShares(query: string, userId: string) {
  const client = await clientPromise;
  const db = client.db();

  const following = await db.collection('follows')
    .find({ userId })
    .toArray();

  const followingIds = following.map(f => f.followingId);

  return db.collection('shares')
    .aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { userId: { $in: followingIds } },
                { userId, visibility: 'PUBLIC' }
              ]
            },
            { text: { $regex: query, $options: 'i' } }
          ]
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
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book'
        }
      },
      {
        $project: {
          _id: 1,
          text: 1,
          createdAt: 1,
          user: { $arrayElemAt: ['$user', 0] },
          book: { $arrayElemAt: ['$book', 0] }
        }
      },
      { $limit: 10 }
    ])
    .toArray();
}