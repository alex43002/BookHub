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
  id: string; // Mapping _id to id as string for frontend usage
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

// Adjusted mapping function to ensure seamless conversion
export function mapMongoBookToBook(book: MongoBook): Book {
  const { _id, ...rest } = book;
  return {
    id: _id.toString(),
    ...rest,
  };
}
