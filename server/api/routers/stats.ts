import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import * as statsDb from '@/lib/db/stats';

export const statsRouter = router({
  overview: protectedProcedure.query(async ({ ctx }) => {
    return statsDb.getReadingStats(ctx.user.id);
  }),

  trends: protectedProcedure
    .input(z.object({
      timeUnit: z.enum(['month', 'day'])
    }))
    .query(async ({ ctx, input }) => {
      return statsDb.getReadingTrends(ctx.user.id, input.timeUnit);
  }),
});