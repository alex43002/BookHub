import { router } from '@/lib/trpc/server';
import { bookRouter } from './routers/book';
import { readingGoalRouter } from './routers/reading-goal';
import { readingSessionRouter } from './routers/reading-session';
import { socialRouter } from './routers/social';
import { challengeRouter } from './routers/challenges';
import { statsRouter } from './routers/stats';
import { analyticsRouter } from './routers/analytics';
import { notificationsRouter } from './routers/notifications';
import { searchRouter } from './routers/search';
import { profileRouter } from './routers/profile';

export const appRouter = router({
  book: bookRouter,
  readingGoal: readingGoalRouter,
  readingSession: readingSessionRouter,
  social: socialRouter,
  challenges: challengeRouter,
  stats: statsRouter,
  analytics: analyticsRouter,
  notifications: notificationsRouter,
  search: searchRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;