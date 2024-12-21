'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Users,
  BarChart3,
  Search,
  UserCircle,
} from 'lucide-react';

export function NavMenu() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/discover',
      label: 'Discover',
      icon: Search,
    },
    {
      href: '/challenges',
      label: 'Challenges',
      icon: Target,
    },
    {
      href: '/social',
      label: 'Social',
      icon: Users,
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: UserCircle,
    },
  ];

  return (
    <NavigationMenu className="max-w-none w-full justify-start">
      <NavigationMenuList className="space-x-2">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <NavigationMenuItem key={href}>
            <Link href={href} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  'flex items-center space-x-2',
                  pathname === href && 'bg-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}