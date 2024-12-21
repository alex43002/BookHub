import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/header';
import { useSession, signOut } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

describe('Header', () => {
  const mockSession = {
    data: {
      user: {
        name: 'Test User',
        image: 'https://example.com/avatar.jpg',
      },
    },
    status: 'authenticated',
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue(mockSession);
  });

  it('renders logo and brand name', () => {
    render(<Header />);
    expect(screen.getByText('BookTracker')).toBeInTheDocument();
  });

  it('renders user avatar when authenticated', () => {
    render(<Header />);
    expect(screen.getByRole('img', { name: 'Test User' })).toBeInTheDocument();
  });

  it('handles sign out', () => {
    render(<Header />);
    
    fireEvent.click(screen.getByRole('button', { name: /test user/i }));
    fireEvent.click(screen.getByText('Sign out'));
    
    expect(signOut).toHaveBeenCalled();
  });

  it('uses avatar fallback when no image', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          image: null,
        },
      },
      status: 'authenticated',
    });

    render(<Header />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });
});