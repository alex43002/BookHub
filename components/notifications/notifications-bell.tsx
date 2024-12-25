'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationsList } from './notifications-list';
import { trpc } from '@/lib/trpc/client';
import { cn } from '@/lib/utils';

interface NotificationsBellProps {
  className?: string;
}

export function NotificationsBell({ className }: NotificationsBellProps) {
  const { data: unreadCount } = trpc.notifications.getUnreadCount.useQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button variant="ghost" size="icon" className={cn("relative", className)}>
            <Bell className="h-5 w-5" />
            {unreadCount && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-4">
        <NotificationsList />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}