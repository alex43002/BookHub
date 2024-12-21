import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import type { ShareFormData } from '@/lib/validators/social';

export async function followUser(userId: string, followingId: string) {
  const client = await clientPromise;
  const db = client.db();

  await db.collection('follows').insertOne({
    userId,
    followingId,
    createdAt: new Date(),
  });

  return { success: true };
}

export async function unfollowUser(userId: string, followingId: string) {
  const client = await clientPromise;
  const db = client.db();

  await db.collection('follows').deleteOne({
    userId,
    followingId,
  });

  return { success: true };
}

export async function getFollowers(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  const followers = await db.collection('follows')
    .aggregate([
      { $match: { followingId: userId } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          _id: 1,
          user: { $arrayElemAt: ['$user', 0] },
          createdAt: 1
        }
      }
    ])
    .toArray();

  return followers;
}

export async function getFollowing(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  const following = await db.collection('follows')
    .aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'users',
          localField: 'followingId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          _id: 1,
          user: { $arrayElemAt: ['$user', 0] },
          createdAt: 1
        }
      }
    ])
    .toArray();

  return following;
}

export async function shareBook(userId: string, data: ShareFormData) {
  const client = await clientPromise;
  const db = client.db();

  const share = await db.collection('shares').insertOne({
    userId,
    ...data,
    createdAt: new Date(),
  });

  return {
    id: share.insertedId.toString(),
    ...data,
    userId,
    createdAt: new Date(),
  };
}

export async function getFeed(userId: string, lastId?: string) {
  const client = await clientPromise;
  const db = client.db();
  const limit = 10;
  const cursor = lastId ? new ObjectId(lastId) : null;

  const following = await db.collection('follows')
    .find({ userId })
    .toArray();

  const followingIds = following.map(f => f.followingId);

  const shares = await db.collection('shares')
    .aggregate([
      {
        $match: {
          ...(lastId ? { _id: { $lt: cursor } } : {}),
          $or: [
            { userId: { $in: followingIds }, visibility: { $in: ['PUBLIC', 'FOLLOWERS'] } },
            { userId, visibility: { $in: ['PUBLIC', 'FOLLOWERS', 'PRIVATE'] } },
            { visibility: 'PUBLIC' }
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
        $lookup: {
          from: 'likes',
          let: { shareId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$shareId', '$$shareId'] },
                    { $eq: ['$userId', userId] }
                  ]
                }
              }
            }
          ],
          as: 'userLike'
        }
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'shareId',
          as: 'likes'
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'shareId',
          as: 'comments'
        }
      },
      {
        $project: {
          _id: 1,
          text: 1,
          visibility: 1,
          createdAt: 1,
          user: { $arrayElemAt: ['$user', 0] },
          book: { $arrayElemAt: ['$book', 0] },
          isLiked: { $gt: [{ $size: '$userLike' }, 0] },
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$comments' }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: limit + 1 }
    ])
    .toArray();

  const hasMore = shares.length > limit;
  const items = shares.slice(0, limit);
  
  return {
    items,
    nextCursor: hasMore ? items[items.length - 1]._id.toString() : undefined
  };
}