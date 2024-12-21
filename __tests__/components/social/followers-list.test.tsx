import { render, screen, fireEvent } from '@testing-library/react';
import { FollowersList } from '@/components/social/followers-list';
import { trpc } from '@/lib/trpc/client';

jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    social: {
      getFollowers: {
        useQuery: jest.fn(),
      },
      follow: {
        useMutation: jest.fn(),
      },
    },
    useContext: jest.fn(() => ({
      social: {
        getFollowers: {
          invalidate: jest.fn(),
        },
        getFollowing: {
          invalidate: jest.fn(),
        },
      },
    })),
  },
}));

describe('FollowersList', () => {
  const mockFollowers = [
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
    (trpc.social.getFollowers.useQuery as jest.Mock).mockReturnValue({
      data: mockFollowers,
      isLoading: false,
    });
  });

  it('renders loading state', () => {
    (trpc.social.getFollowers.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<FollowersList userId="user1" />);
    expect(screen.getByText(/loading followers/i)).toBeInTheDocument();
  });

  it('renders empty state', () => {
    (trpc.social.getFollowers.useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<FollowersList userId="user1" />);
    expect(screen.getByText(/no followers yet/i)).toBeInTheDocument();
  });

  it('renders followers list', () => {
    render(<FollowersList userId="user1" />);
    
    expect(screen.getByText(mockFollowers[0].user.name)).toBeInTheDocument();
    expect(screen.getByText(/following since/i)).toBeInTheDocument();
  });

  it('handles follow back action', () => {
    const mockMutate = jest.fn();
    (trpc.social.follow.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    });

    render(<FollowersList userId="user1" />);
    
    fireEvent.click(screen.getByRole('button', { name: /follow back/i }));
    expect(mockMutate).toHaveBeenCalledWith({
      followingId: mockFollowers[0].user._id,
    });
  });
});