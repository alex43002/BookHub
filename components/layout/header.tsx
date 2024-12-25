'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { DesktopNavMenu, MobileNavMenu } from './nav-menu';
import { BookOpen, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center space-x-4 sm:space-x-8">
          <div className="flex items-center space-x-2 min-w-0 shrink-0">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="text-base sm:text-lg font-semibold hidden xs:block">BookTracker</span>
          </div>
        </div>

        {/* Navigation Links or Search */}
        <div className="flex-1 flex justify-center md:justify-start">
          <div className="hidden md:flex">
            <DesktopNavMenu />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block md:hidden w-full max-w-sm px-4 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Toggle Theme */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 sm:h-10 w-9 sm:w-10"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || ''} />
                  <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* All Menu Items for Small Screens */}
              <div className="block md:hidden">
                <MobileNavMenu />
              </div>
              {/* Profile & Sign Out */}
              {session && (
                <>
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center space-x-2 w-full hover:text-primary transition">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    Sign out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
