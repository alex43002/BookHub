import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import { readingGoalSchema } from '@/lib/validators/reading-goal';
import * as goalDb from '@/lib/db/reading-goals';

export const readingGoalRouter = router({
  create: protectedProcedure
    .input(readingGoalSchema)
    .mutation(async ({ input, ctx }) => {
      return goalDb.createGoal(ctx.user.id, input);
    }),

  getCurrentGoal: protectedProcedure
    .query(async ({ ctx }) => {
      return goalDb.getCurrentGoal(ctx.user.id);
    }),

  updateProgress: protectedProcedure
    .input(z.object({
      id: z.string(),
      progress: z.number().min(0),
    }))
    .mutation(async ({ input, ctx }) => {
      return goalDb.updateGoalProgress(input.id, ctx.user.id, input.progress);
    }),
});