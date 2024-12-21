import { router } from '@/lib/trpc/server';
import { bookRouter } from './routers/book';

export const appRouter = router({
  book: bookRouter,
});

export type AppRouter = typeof appRouter;