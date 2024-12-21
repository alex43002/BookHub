import { render, screen } from '@testing-library/react';
import { NavMenu } from '@/components/layout/nav-menu';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('NavMenu', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user1' } },
      status: 'authenticated',
    });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
  });

  it('renders nothing when not authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    const { container } = render(<NavMenu />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders all navigation items when authenticated', () => {
    render(<NavMenu />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('highlights current route', () => {
    render(<NavMenu />);
    
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-accent');
  });
});