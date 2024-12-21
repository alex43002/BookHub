import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReadingSessionDialog } from '@/components/books/reading-session-dialog';
import { trpc } from '@/lib/trpc/client';
import { Book } from '@prisma/client';

jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    readingSession: {
      create: {
        useMutation: jest.fn(),
      },
    },
    useContext: jest.fn(() => ({
      book: {
        get: {
          invalidate: jest.fn(),
        },
        readingSession: {
          list: {
            invalidate: jest.fn(),
          },
        },
      },
    })),
  },
}));

describe('ReadingSessionDialog', () => {
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

  const mockMutation = {
    mutate: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    (trpc.readingSession.create.useMutation as jest.Mock).mockReturnValue(mockMutation);
  });

  it('initializes form with current page', () => {
    render(
      <ReadingSessionDialog book={mockBook}>
        <button>Log Session</button>
      </ReadingSessionDialog>
    );

    fireEvent.click(screen.getByRole('button', { name: /log session/i }));
    
    expect(screen.getByRole('spinbutton', { name: /start page/i }))
      .toHaveValue(mockBook.currentPage);
  });

  it('validates page numbers', async () => {
    render(
      <ReadingSessionDialog book={mockBook}>
        <button>Log Session</button>
      </ReadingSessionDialog>
    );

    fireEvent.click(screen.getByRole('button', { name: /log session/i }));
    
    // Set invalid values
    fireEvent.change(screen.getByRole('spinbutton', { name: /end page/i }), {
      target: { value: '40' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save session/i }));

    await waitFor(() => {
      expect(screen.getByText(/end page must be greater than start page/i))
        .toBeInTheDocument();
    });
  });

  it('submits valid session data', async () => {
    render(
      <ReadingSessionDialog book={mockBook}>
        <button>Log Session</button>
      </ReadingSessionDialog>
    );

    fireEvent.click(screen.getByRole('button', { name: /log session/i }));
    
    fireEvent.change(screen.getByRole('spinbutton', { name: /end page/i }), {
      target: { value: '75' },
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: /duration/i }), {
      target: { value: '30' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save session/i }));

    await waitFor(() => {
      expect(mockMutation.mutate).toHaveBeenCalledWith({
        bookId: mockBook.id,
        startPage: 50,
        endPage: 75,
        duration: 30,
        date: expect.any(Date),
      });
    });
  });
});