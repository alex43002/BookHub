import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import { challengeSchema } from '@/lib/validators/challenge';
import * as challengeDb from '@/lib/db/challenges';

export const challengeRouter = router({
  create: protectedProcedure
    .input(challengeSchema)
    .mutation(async ({ input, ctx }) => {
      return challengeDb.createChallenge(ctx.user.id, input);
    }),

  getActive: protectedProcedure
    .query(async ({ ctx }) => {
      return challengeDb.getActiveChallenges(ctx.user.id);
    }),

  getCompleted: protectedProcedure
    .query(async ({ ctx }) => {
      return challengeDb.getCompletedChallenges(ctx.user.id);
    }),

  updateProgress: protectedProcedure
    .input(z.object({
      id: z.string(),
      progress: z.number().min(0),
    }))
    .mutation(async ({ input, ctx }) => {
      return challengeDb.updateChallengeProgress(
        input.id,
        ctx.user.id,
        input.progress
      );
    }),
});