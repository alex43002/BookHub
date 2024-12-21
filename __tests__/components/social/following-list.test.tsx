import { render, screen, fireEvent } from '@testing-library/react';
import { FollowingList } from '@/components/social/following-list';
import { trpc } from '@/lib/trpc/client';

jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    social: {
      getFollowing: {
        useQuery: jest.fn(),
      },
      unfollow: {
        useMutation: jest.fn(),
      },
    },
    useContext: jest.fn(() => ({
      social: {
        getFollowing: {
          invalidate: jest.fn(),
        },
      },
    })),
  },
}));

describe('FollowingList', () => {
  const mockFollowing = [
    {
      _id: '1',
      user: {
        _id: 'user1',
        name: 'Test User',
        image: 'https://example.com/avatar.jpg',
      },
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    (trpc.social.getFollowing.useQuery as jest.Mock).mockReturnValue({
      data: mockFollowing,
      isLoading: false,
    });
  });

  it('renders loading state', () => {
    (trpc.social.getFollowing.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<FollowingList userId="user1" />);
    expect(screen.getByText(/loading following/i)).toBeInTheDocument();
  });

  it('renders empty state', () => {
    (trpc.social.getFollowing.useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<FollowingList userId="user1" />);
    expect(screen.getByText(/not following anyone yet/i)).toBeInTheDocument();
  });

  it('renders following list', () => {
    render(<FollowingList userId="user1" />);
    
    expect(screen.getByText(mockFollowing[0].user.name)).toBeInTheDocument();
    expect(screen.getByText(/following since/i)).toBeInTheDocument();
  });

  it('handles unfollow action', () => {
    const mockMutate = jest.fn();
    (trpc.social.unfollow.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    });

    render(<FollowingList userId="user1" />);
    
    fireEvent.click(screen.getByRole('button', { name: /unfollow/i }));
    expect(mockMutate).toHaveBeenCalledWith({
      followingId: mockFollowing[0].user._id,
    });
  });
});