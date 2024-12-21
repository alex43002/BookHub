import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { trpc } from '@/lib/trpc/client';
import { BookList } from '@/components/books/book-list';
import { AddBookDialog } from '@/components/books/add-book-dialog';

// Mock trpc
jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    book: {
      list: {
        useQuery: jest.fn(),
      },
      create: {
        useMutation: jest.fn(),
      },
      delete: {
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

describe('Book Management Integration', () => {
  const mockBooks = [
    {
      id: '1',
      title: 'Test Book 1',
      author: 'Author 1',
      status: 'READING',
      currentPage: 50,
      totalPages: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    (trpc.book.list.useQuery as jest.Mock).mockReturnValue({
      data: mockBooks,
      isLoading: false,
    });
  });

  describe('Book List and Filtering', () => {
    it('integrates search with status filtering', () => {
      render(<BookList />);

      // Search for a book
      fireEvent.change(screen.getByPlaceholderText(/search books/i), {
        target: { value: 'Test Book' },
      });

      // Filter by status
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'READING' },
      });

      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    it('shows no results when filters exclude all books', () => {
      render(<BookList />);

      fireEvent.change(screen.getByPlaceholderText(/search books/i), {
        target: { value: 'Nonexistent' },
      });

      expect(screen.getByText(/no books match your filters/i)).toBeInTheDocument();
    });
  });

  describe('Add Book Flow', () => {
    const mockCreateMutation = {
      mutate: jest.fn(),
      isLoading: false,
    };

    beforeEach(() => {
      (trpc.book.create.useMutation as jest.Mock).mockReturnValue(mockCreateMutation);
    });

    it('validates required fields', async () => {
      render(<AddBookDialog>
        <button>Add Book</button>
      </AddBookDialog>);

      // Open dialog
      fireEvent.click(screen.getByRole('button', { name: /add book/i }));

      // Try to submit without required fields
      fireEvent.click(screen.getByRole('button', { name: /add$/i }));

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/author is required/i)).toBeInTheDocument();
      });
    });

    it('successfully adds a new book', async () => {
      render(<AddBookDialog>
        <button>Add Book</button>
      </AddBookDialog>);

      // Open dialog
      fireEvent.click(screen.getByRole('button', { name: /add book/i }));

      // Fill form
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'New Book' },
      });
      fireEvent.change(screen.getByLabelText(/author/i), {
        target: { value: 'New Author' },
      });
      fireEvent.change(screen.getByLabelText(/total pages/i), {
        target: { value: '200' },
      });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /add$/i }));

      await waitFor(() => {
        expect(mockCreateMutation.mutate).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Book',
            author: 'New Author',
            totalPages: 200,
          })
        );
      });
    });
  });
});