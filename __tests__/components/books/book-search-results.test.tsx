import { render, screen, fireEvent } from '@testing-library/react';
import { BookSearchResults } from '@/components/books/book-search-results';
import { trpc } from '@/lib/trpc/client';

jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    book: {
      search: {
        useQuery: jest.fn(),
      },
      create: {
        useMutation: jest.fn(),
      },
    },
    useContext: jest.fn(() => ({
      book: {
        list: {
          invalidate: jest.fn(),
        },
      },
    })),
  },
}));

describe('BookSearchResults', () => {
  const mockBooks = [
    {
      id: '1',
      title: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
      coverImage: 'https://example.com/cover.jpg',
    },
  ];

  beforeEach(() => {
    (trpc.book.search.useQuery as jest.Mock).mockReturnValue({
      data: mockBooks,
      isLoading: false,
    });
  });

  it('renders loading state', () => {
    (trpc.book.search.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<BookSearchResults query="test" />);
    expect(screen.getByText(/searching books/i)).toBeInTheDocument();
  });

  it('renders no results message', () => {
    (trpc.book.search.useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<BookSearchResults query="test" />);
    expect(screen.getByText(/no books found/i)).toBeInTheDocument();
  });

  it('renders book results', () => {
    render(<BookSearchResults query="test" />);
    
    expect(screen.getByText(mockBooks[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockBooks[0].author)).toBeInTheDocument();
    expect(screen.getByText(mockBooks[0].description)).toBeInTheDocument();
  });

  it('handles add book action', () => {
    const mockMutate = jest.fn();
    (trpc.book.create.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });

    render(<BookSearchResults query="test" />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockMutate).toHaveBeenCalledWith(mockBooks[0]);
  });
});