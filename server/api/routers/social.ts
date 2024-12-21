import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import { followSchema, shareSchema, commentSchema } from '@/lib/validators/social';
import * as socialDb from '@/lib/db/social';
import * as likesDb from '@/lib/db/likes';
import * as commentsDb from '@/lib/db/comments';

export const socialRouter = router({
  toggleLike: protectedProcedure
    .input(z.object({ shareId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return likesDb.toggleLike(ctx.user.id, input.shareId);
    }),

  addComment: protectedProcedure
    .input(commentSchema)
    .mutation(async ({ input, ctx }) => {
      return commentsDb.addComment(ctx.user.id, input.shareId, input.text);
    }),

  getComments: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return commentsDb.getComments(input);
    }),

  follow: protectedProcedure
    .input(followSchema)
    .mutation(async ({ input, ctx }) => {
      return socialDb.followUser(ctx.user.id, input.followingId);
    }),

  unfollow: protectedProcedure
    .input(followSchema)
    .mutation(async ({ input, ctx }) => {
      return socialDb.unfollowUser(ctx.user.id, input.followingId);
    }),

  getFollowers: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return socialDb.getFollowers(input);
    }),

  getFollowing: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return socialDb.getFollowing(input);
    }),

  share: protectedProcedure
    .input(shareSchema)
    .mutation(async ({ input, ctx }) => {
      return socialDb.shareBook(ctx.user.id, input);
    }),

  getFeed: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx }) => {
      return socialDb.getFeed(ctx.user.id);
    }),
});