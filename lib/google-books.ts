import { searchResultSchema } from '@/lib/types/search';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    pageCount?: number;
    imageLinks?: {
      thumbnail: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

export async function searchBooks(query: string) {
  const response = await fetch(
    `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=10`
  );
  const data = await response.json();

  const results = data.items?.map((item: GoogleBook) => ({
    id: item.id,
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors?.[0] || 'Unknown Author',
    description: item.volumeInfo.description,
    totalPages: item.volumeInfo.pageCount || 0,
    coverImage: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
    isbn: item.volumeInfo.industryIdentifiers?.find(
      (id) => id.type === 'ISBN_13'
    )?.identifier,
  }));

  // Validate results
  return results?.map((result: unknown) => searchResultSchema.parse(result)) || [];
}