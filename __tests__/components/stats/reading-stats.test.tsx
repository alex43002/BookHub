import { render, screen } from '@testing-library/react';
import { ReadingStats } from '@/components/stats/reading-stats';
import { trpc } from '@/lib/trpc/client';

jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    stats: {
      overview: {
        useQuery: jest.fn(),
      },
    },
  },
}));

describe('ReadingStats', () => {
  const mockStats = {
    completedBooks: 5,
    currentlyReading: 2,
    totalPagesRead: 1250,
    totalReadingTime: 720,
    averageReadingTime: 30,
  };

  beforeEach(() => {
    (trpc.stats.overview.useQuery as jest.Mock).mockReturnValue({
      data: mockStats,
      isLoading: false,
    });
  });

  it('renders loading state', () => {
    (trpc.stats.overview.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<ReadingStats />);
    expect(screen.getByText(/loading stats/i)).toBeInTheDocument();
  });

  it('renders reading statistics', () => {
    render(<ReadingStats />);
    
    expect(screen.getByText('5 (2 in progress)')).toBeInTheDocument();
    expect(screen.getByText('1250')).toBeInTheDocument();
    expect(screen.getByText('720m')).toBeInTheDocument();
  });

  it('handles null data', () => {
    (trpc.stats.overview.useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<ReadingStats />);
    expect(screen.queryByText(/books read/i)).not.toBeInTheDocument();
  });

  it('displays average reading time', () => {
    render(<ReadingStats />);
    expect(screen.getByText(/avg\. 30 minutes per session/i)).toBeInTheDocument();
  });
});