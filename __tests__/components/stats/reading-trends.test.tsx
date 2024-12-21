import { render, screen } from '@testing-library/react';
import { ReadingTrends } from '@/components/stats/reading-trends';
import { trpc } from '@/lib/trpc/client';

jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    stats: {
      trends: {
        useQuery: jest.fn(),
      },
    },
  },
}));

describe('ReadingTrends', () => {
  const mockTrends = [
    { month: '2024-01-01', pagesRead: 150 },
    { month: '2024-02-01', pagesRead: 200 },
    { month: '2024-03-01', pagesRead: 175 },
  ];

  beforeEach(() => {
    (trpc.stats.trends.useQuery as jest.Mock).mockReturnValue({
      data: mockTrends,
      isLoading: false,
    });
  });

  it('renders loading state', () => {
    (trpc.stats.trends.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<ReadingTrends />);
    expect(screen.getByText(/loading trends/i)).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    (trpc.stats.trends.useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<ReadingTrends />);
    expect(screen.getByText(/no reading data available/i)).toBeInTheDocument();
  });

  it('renders chart with data', () => {
    render(<ReadingTrends />);
    expect(screen.getByText('Reading Trends')).toBeInTheDocument();
  });
});