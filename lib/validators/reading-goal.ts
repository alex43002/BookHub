import { z } from 'zod';

export const readingGoalSchema = z.object({
  type: z.enum(['BOOKS_PER_YEAR', 'PAGES_PER_DAY', 'MINUTES_PER_DAY']),
  target: z.number().min(1, 'Target must be at least 1'),
  startDate: z.date(),
  endDate: z.date(),
});

export type ReadingGoalFormData = z.infer<typeof readingGoalSchema>;