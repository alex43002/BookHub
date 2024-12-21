import { ObjectId } from 'mongodb';

export type BookStatus = 'UNREAD' | 'READING' | 'COMPLETED';

export interface MongoBook {
  _id: ObjectId;
  title: string;
  author: string;
  isbn?: string | null;
  coverImage?: string | null;
  totalPages: number;
  currentPage: number;
  status: BookStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string | null;
  coverImage?: string | null;
  totalPages: number;
  currentPage: number;
  status: BookStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}