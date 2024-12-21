'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { NavMenu } from './nav-menu';
import { BookOpen, Moon, Sun, Search } from 'lucide-react';
import { NotificationsBell } from '@/components/notifications/notifications-bell';
import { SearchDialog } from '@/components/search/search-dialog';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">BookTracker</span>
          </div>
          <NavMenu />
        </div>

        {session && (
          <div className="flex items-center space-x-4">
            <SearchDialog>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Search className="mr-2 h-4 w-4" />
                Search...
              </Button>
            </SearchDialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <NotificationsBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || undefined} alt={session.user.name || ''} />
                  <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => signOut()}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}