import { render, screen } from '@testing-library/react';
import { SessionHistory } from '@/components/books/session-history';
import { trpc } from '@/lib/trpc/client';
import { Book } from '@prisma/client';

jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    readingSession: {
      list: {
        useQuery: jest.fn(),
      },
    },
  },
}));

describe('SessionHistory', () => {
  const mockBook: Book = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    currentPage: 50,
    totalPages: 200,
    status: 'READING',
    isbn: null,
    coverImage: null,
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSessions = [
    {
      id: '1',
      bookId: '1',
      startPage: 1,
      endPage: 25,
      duration: 30,
      date: new Date(),
      userId: 'user1',
    },
    {
      id: '2',
      bookId: '1',
      startPage: 25,
      endPage: 50,
      duration: 45,
      date: new Date(),
      userId: 'user1',
    },
  ];

  beforeEach(() => {
    (trpc.readingSession.list.useQuery as jest.Mock).mockReturnValue({
      data: mockSessions,
      isLoading: false,
    });
  });

  it('renders loading state', () => {
    (trpc.readingSession.list.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<SessionHistory book={mockBook} />);
    expect(screen.getByText(/loading sessions/i)).toBeInTheDocument();
  });

  it('renders empty state when no sessions', () => {
    (trpc.readingSession.list.useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<SessionHistory book={mockBook} />);
    expect(screen.getByText(/no reading sessions recorded yet/i)).toBeInTheDocument();
  });

  it('renders session list', () => {
    render(<SessionHistory book={mockBook} />);

    expect(screen.getByText(/pages 1 - 25/i)).toBeInTheDocument();
    expect(screen.getByText(/30 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/pages 25 - 50/i)).toBeInTheDocument();
    expect(screen.getByText(/45 minutes/i)).toBeInTheDocument();
  });
});