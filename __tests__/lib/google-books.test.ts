import { searchBooks } from '@/lib/google-books';

describe('Google Books API', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('transforms Google Books API response correctly', async () => {
    const mockApiResponse = {
      items: [
        {
          id: '12345',
          volumeInfo: {
            title: 'Test Book',
            authors: ['Test Author'],
            description: 'Test Description',
            pageCount: 200,
            imageLinks: {
              thumbnail: 'http://example.com/cover.jpg',
            },
            industryIdentifiers: [
              {
                type: 'ISBN_13',
                identifier: '9781234567890',
              },
            ],
          },
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockApiResponse),
    });

    const results = await searchBooks('test query');

    expect(results[0]).toEqual({
      id: '12345',
      title: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
      totalPages: 200,
      coverImage: 'https://example.com/cover.jpg',
      isbn: '9781234567890',
    });
  });

  it('handles missing fields gracefully', async () => {
    const mockApiResponse = {
      items: [
        {
          id: '12345',
          volumeInfo: {
            title: 'Test Book',
          },
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockApiResponse),
    });

    const results = await searchBooks('test query');

    expect(results[0]).toEqual({
      id: '12345',
      title: 'Test Book',
      author: 'Unknown Author',
      description: undefined,
      totalPages: 0,
      coverImage: undefined,
      isbn: undefined,
    });
  });

  it('returns empty array when no results', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({}),
    });

    const results = await searchBooks('test query');
    expect(results).toEqual([]);
  });
});