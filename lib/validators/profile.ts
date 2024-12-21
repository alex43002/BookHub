import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  emailNotifications: z.boolean(),
  readingReminders: z.boolean(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;