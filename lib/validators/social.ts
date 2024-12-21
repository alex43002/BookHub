import { z } from 'zod';

export const followSchema = z.object({
  followingId: z.string(),
});

export const shareSchema = z.object({
  bookId: z.string(),
  text: z.string().max(280, 'Share text must be less than 280 characters'),
  visibility: z.enum(['PUBLIC', 'FOLLOWERS', 'PRIVATE'])
});

export const commentSchema = z.object({
  text: z.string().min(1).max(500, 'Comment must be less than 500 characters'),
  shareId: z.string()
});

export type ShareFormData = z.infer<typeof shareSchema>;