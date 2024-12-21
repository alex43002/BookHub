import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import { profileSchema } from '@/lib/validators/profile';
import * as profileDb from '@/lib/db/profile';

export const profileRouter = router({
  get: protectedProcedure
    .query(async ({ ctx }) => {
      return profileDb.getProfile(ctx.user.id);
    }),

  update: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ input, ctx }) => {
      return profileDb.updateProfile(ctx.user.id, input);
    }),
});