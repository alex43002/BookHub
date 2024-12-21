import { z } from 'zod';

export const readingSessionSchema = z
  .object({
    startPage: z.number().min(0, 'Start page cannot be negative'),
    endPage: z.number().min(0, 'End page cannot be negative'),
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
    date: z.date(),
  })
  .refine((data) => data.endPage > data.startPage, {
    message: 'End page must be greater than start page',
    path: ['endPage'],
  });

export type ReadingSessionFormData = z.infer<typeof readingSessionSchema>;