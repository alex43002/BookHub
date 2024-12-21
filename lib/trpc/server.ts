import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const t = initTRPC.context().create({
  transformer: superjson,
});

const isAuthed = t.middleware(async (opts) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      user: session.user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);