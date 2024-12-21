import { render, screen } from '@testing-library/react';
import { GoalProgress } from '@/components/goals/goal-progress';
import { trpc } from '@/lib/trpc/client';

jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    readingGoal: {
      getCurrentGoal: {
        useQuery: jest.fn(),
      },
    },
  },
}));

describe('GoalProgress', () => {
  const mockGoal = {
    id: '1',
    type: 'BOOKS_PER_YEAR',
    target: 24,
    progress: 12,
    startDate: new Date(),
    endDate: new Date(new Date().getFullYear(), 11, 31),
  };

  beforeEach(() => {
    (trpc.readingGoal.getCurrentGoal.useQuery as jest.Mock).mockReturnValue({
      data: mockGoal,
      isLoading: false,
    });
  });

  it('renders loading state', () => {
    (trpc.readingGoal.getCurrentGoal.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<GoalProgress />);
    expect(screen.getByText(/loading goal/i)).toBeInTheDocument();
  });

  it('renders goal progress', () => {
    render(<GoalProgress />);
    
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('12 books to go')).toBeInTheDocument();
  });

  it('handles no active goal', () => {
    (trpc.readingGoal.getCurrentGoal.useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    const { container } = render(<GoalProgress />);
    expect(container).toBeEmptyDOMElement();
  });

  it('caps progress at 100%', () => {
    (trpc.readingGoal.getCurrentGoal.useQuery as jest.Mock).mockReturnValue({
      data: { ...mockGoal, progress: 30 },
      isLoading: false,
    });

    render(<GoalProgress />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});