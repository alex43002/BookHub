'use client';

import Link from 'next/link';
import { LayoutDashboard, Search, Target, Users, BarChart3, UserCircle } from 'lucide-react';

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

// Shared styles for menu buttons
const baseButtonStyles =
  'flex items-center p-2 rounded-md transition duration-200 transform focus:outline-none focus:ring focus:ring-offset-2 focus:ring-primary';
const lightHoverStyles = 'hover:bg-[#e0e0e0] hover:shadow-md hover:scale-105';
const darkHoverStyles = 'dark:hover:bg-[#333333] dark:shadow-md dark:hover:scale-105';
const activeStyles = 'active:scale-95 active:bg-opacity-75';

export function DesktopNavMenu() {
  return (
    <nav className="hidden md:flex space-x-4">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${baseButtonStyles} ${lightHoverStyles} ${darkHoverStyles} ${activeStyles}`}
        >
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}

export function MobileNavMenu() {
  return (
    <nav className="flex flex-col space-y-2">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${baseButtonStyles} ${lightHoverStyles} ${darkHoverStyles} ${activeStyles}`}
        >
          <item.icon className="mr-2 h-5 w-5 text-gray-800 dark:text-gray-200" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
