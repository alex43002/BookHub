import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import { readingSessionSchema } from '@/lib/validators/reading-session';
import * as sessionDb from '@/lib/db/reading-sessions';

export const readingSessionRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        startPage: z.number(),
        endPage: z.number(),
        duration: z.number(),
        date: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return sessionDb.createSession(ctx.user.id, input);
    }),

  list: protectedProcedure
    .input(
      z.object({
        bookId: z.string().optional(),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      return sessionDb.listSessions(ctx.user.id, input?.bookId);
    }),
});