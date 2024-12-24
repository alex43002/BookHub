import { z } from 'zod';

// Base interface for reading session data
export interface ReadingSession {
  id: string;
  startPage: number;
  endPage: number;
  duration: number;
  date: Date;
  bookId: string;
  userId: string;
}

// MongoDB specific interface
export interface MongoReadingSession {
  _id: string;
  startPage: number;
  endPage: number;
  duration: number;
  date: Date;
  bookId: string;
  userId: string;
}

// Stats interface for UI display
export interface ReadingSessionStats {
  pagesRead: number;
  readingSpeed: number;
  formattedDate: string;
  formattedTime: string;
  timezone: string;
}

// New interface for book update history
export interface BookUpdateHistory {
  id: string;
  bookId: string;
  userId: string;
  pagesRead: number;
  date: Date;
}

export interface MongoBookUpdateHistory {
  _id: string;
  bookId: string;
  userId: string;
  pagesRead: number;
  date: Date;
}

// Schema for form validation
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
  })
  .refine((data) => data.duration <= 24 * 60, {
    message: 'Duration cannot exceed 24 hours',
    path: ['duration'],
  });

export type ReadingSessionFormData = z.infer<typeof readingSessionSchema>;
