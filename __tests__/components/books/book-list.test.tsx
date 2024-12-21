import { render, screen, fireEvent } from '@testing-library/react';
import { BookList } from '@/components/books/book-list';
import { trpc } from '@/lib/trpc/client';

// Mock trpc
jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    book: {
      list: {
        useQuery: jest.fn(),
      },
    },
  },
}));

describe('BookList', () => {
  const mockBooks = [
    {
      id: '1',
      title: 'Test Book 1',
      author: 'Author 1',
      status: 'READING',
      currentPage: 50,
      totalPages: 100,
      coverImage: 'https://example.com/cover1.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Test Book 2',
      author: 'Author 2',
      status: 'COMPLETED',
      currentPage: 200,
      totalPages: 200,
      coverImage: 'https://example.com/cover2.jpg',
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

  it('renders loading state', () => {
    (trpc.book.list.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<BookList />);
    expect(screen.getByText(/loading books/i)).toBeInTheDocument();
  });

  it('renders books list', () => {
    render(<BookList />);
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();
  });

  it('filters books by search', () => {
    render(<BookList />);
    
    const searchInput = screen.getByPlaceholderText(/search books/i);
    fireEvent.change(searchInput, { target: { value: 'Book 1' } });

    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument();
  });

  it('filters books by status', () => {
    render(<BookList />);
    
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'COMPLETED' } });

    expect(screen.queryByText('Test Book 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();
  });

  it('shows empty state when no books match filters', () => {
    render(<BookList />);
    
    const searchInput = screen.getByPlaceholderText(/search books/i);
    fireEvent.change(searchInput, { target: { value: 'Non-existent Book' } });

    expect(screen.getByText(/no books match your filters/i)).toBeInTheDocument();
  });
});