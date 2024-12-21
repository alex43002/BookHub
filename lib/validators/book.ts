import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().optional(),
  coverImage: z.string().url().optional(),
  totalPages: z.number().min(1, 'Total pages must be at least 1'),
  currentPage: z.number().min(0, 'Current page cannot be negative'),
  status: z.enum(['UNREAD', 'READING', 'COMPLETED']).default('UNREAD'),
});

export type BookFormData = z.infer<typeof bookSchema>;