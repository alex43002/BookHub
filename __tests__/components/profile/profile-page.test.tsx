import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '@/app/profile/page';
import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('@/lib/trpc/client', () => ({
  trpc: {
    profile: {
      get: {
        useQuery: jest.fn(),
      },
      update: {
        useMutation: jest.fn(),
      },
    },
    useContext: jest.fn(() => ({
      profile: {
        get: {
          invalidate: jest.fn(),
        },
      },
    })),
  },
}));

describe('ProfilePage', () => {
  const mockProfile = {
    name: 'Test User',
    email: 'test@example.com',
    bio: 'Test bio',
    avatarUrl: 'https://example.com/avatar.jpg',
    emailNotifications: true,
    readingReminders: false,
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user1' } },
      status: 'authenticated',
    });

    (trpc.profile.get.useQuery as jest.Mock).mockReturnValue({
      data: mockProfile,
      isLoading: false,
    });

    (trpc.profile.update.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });
  });

  it('renders loading state', () => {
    (trpc.profile.get.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<ProfilePage />);
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  it('renders profile form with data', () => {
    render(<ProfilePage />);
    
    expect(screen.getByDisplayValue(mockProfile.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.bio)).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const mockMutate = jest.fn();
    (trpc.profile.update.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });

    render(<ProfilePage />);
    
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Name',
      }));
    });
  });

  it('validates required fields', async () => {
    render(<ProfilePage />);
    
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });
});