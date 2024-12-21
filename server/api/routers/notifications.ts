import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import * as notificationsDb from '@/lib/db/notifications';

export const notificationsRouter = router({
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      cursor: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      return notificationsDb.getNotifications(
        ctx.user.id,
        input.limit,
        input.cursor
      );
    }),

  getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const notifications = await notificationsDb.getUnreadNotifications(ctx.user.id);
      return notifications.length;
    }),

  markAsRead: protectedProcedure
    .input(z.string().optional())
    .mutation(async ({ input, ctx }) => {
      if (input) {
        return notificationsDb.markNotificationAsRead(input, ctx.user.id);
      }
      // Mark all as read if no specific notification ID is provided
      const unread = await notificationsDb.getUnreadNotifications(ctx.user.id);
      await Promise.all(
        unread.map(n => notificationsDb.markNotificationAsRead(n._id.toString(), ctx.user.id))
      );
      return { success: true };
    }),
});