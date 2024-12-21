import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import * as analyticsDb from '@/lib/db/analytics';

export const analyticsRouter = router({
  overview: protectedProcedure.query(async ({ ctx }) => {
    return analyticsDb.getOverview(ctx.user.id);
  }),

  dailySessions: protectedProcedure
    .input(z.object({
      date: z.date(),
    }).optional())
    .query(async ({ input, ctx }) => {
      return analyticsDb.getDailySessions(ctx.user.id, input?.date);
    }),

  readingHeatmap: protectedProcedure.query(async ({ ctx }) => {
    return analyticsDb.getReadingHeatmap(ctx.user.id);
  }),

  readingPace: protectedProcedure.query(async ({ ctx }) => {
    return analyticsDb.getReadingPace(ctx.user.id);
  }),

  genreDistribution: protectedProcedure.query(async ({ ctx }) => {
    return analyticsDb.getGenreDistribution(ctx.user.id);
  }),
});