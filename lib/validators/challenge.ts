import { z } from 'zod';

export const challengeSchema = z.object({
  type: z.enum([
    'BOOKS_IN_TIME',
    'PAGES_IN_TIME',
    'READING_STREAK',
    'GENRE_EXPLORER',
    'COMPLETION_RATE'
  ]),
  target: z.number().min(1, 'Target must be at least 1'),
  timeframe: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']).optional(),
  startDate: z.date(),
  endDate: z.date(),
  description: z.string(),
});

export type ChallengeFormData = z.infer<typeof challengeSchema>;