import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SignIn from '@/app/auth/signin/page';
import SignUp from '@/app/auth/signup/page';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Authentication Flow', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  describe('SignIn Page', () => {
    it('handles successful sign in', async () => {
      (signIn as jest.Mock).mockResolvedValue({ error: null });

      render(<SignIn />);

      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('displays error on invalid credentials', async () => {
      (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });

      render(<SignIn />);

      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'wrong@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'wrongpass' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('navigates to sign up page', () => {
      render(<SignIn />);
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/signup');
    });
  });

  describe('SignUp Page', () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    beforeEach(() => {
      mockFetch.mockClear();
    });

    it('handles successful registration', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'User created successfully' }),
      });
      (signIn as jest.Mock).mockResolvedValue({ error: null });

      render(<SignUp />);

      fireEvent.change(screen.getByPlaceholderText(/name/i), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('displays error on registration failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'User already exists' }),
      });

      render(<SignUp />);

      fireEvent.change(screen.getByPlaceholderText(/name/i), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'existing@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
      });
    });

    it('navigates to sign in page', () => {
      render(<SignUp />);
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin');
    });
  });
});