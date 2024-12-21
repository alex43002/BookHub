import { createNotification } from '@/lib/db/notifications';

export async function notifyLike(userId: string, shareId: string, likedByUser: any) {
  await createNotification(userId, 'LIKE', {
    shareId,
    user: likedByUser,
    message: `${likedByUser.name} liked your post`,
  });
}

export async function notifyComment(userId: string, shareId: string, commentByUser: any) {
  await createNotification(userId, 'COMMENT', {
    shareId,
    user: commentByUser,
    message: `${commentByUser.name} commented on your post`,
  });
}

export async function notifyFollow(userId: string, followerUser: any) {
  await createNotification(userId, 'FOLLOW', {
    user: followerUser,
    message: `${followerUser.name} started following you`,
  });
}

export async function notifyGoalAchieved(userId: string, goalType: string, target: number) {
  await createNotification(userId, 'GOAL_ACHIEVED', {
    goalType,
    target,
    message: `Congratulations! You've achieved your reading goal of ${target} ${goalType.toLowerCase().replace('_', ' ')}`,
  });
}

export async function notifyReadingReminder(userId: string, bookTitle: string) {
  await createNotification(userId, 'READING_REMINDER', {
    bookTitle,
    message: `Don't forget to continue reading "${bookTitle}" today!`,
  });
}