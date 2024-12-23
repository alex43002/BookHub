import { z } from 'zod';

export const searchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string().optional(),
  totalPages: z.number(),
  coverImage: z.string().url().optional(),
  isbn: z.string().optional(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;