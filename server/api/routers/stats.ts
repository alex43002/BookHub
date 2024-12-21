import { router, protectedProcedure } from '@/lib/trpc/server';
import * as statsDb from '@/lib/db/stats';

export const statsRouter = router({
  overview: protectedProcedure.query(async ({ ctx }) => {
    return statsDb.getReadingStats(ctx.user.id);
  }),

  trends: protectedProcedure.query(async ({ ctx }) => {
    return statsDb.getReadingTrends(ctx.user.id);
  }),
});