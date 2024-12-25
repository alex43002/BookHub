'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatRelativeTime } from '@/lib/utils/date';
import { trpc } from '@/lib/trpc/client';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Bell, Heart, MessageCircle, UserPlus, Target } from 'lucide-react';

const NotificationIcon = {
  LIKE: Heart,
  COMMENT: MessageCircle,
  FOLLOW: UserPlus,
  GOAL_ACHIEVED: Target,
  READING_REMINDER: Bell,
};

export function NotificationsList() {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.notifications.list.useInfiniteQuery(
    { limit: 20 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();

  const loadMoreRef = useInfiniteScroll(
    () => fetchNextPage(),
    !!hasNextPage,
    isFetchingNextPage
  );

  // Mark notifications as read when viewed
  useEffect(() => {
    if (data?.pages.some((page) => page.items.length > 0)) {
      markAsReadMutation.mutate();
    }
  }, [data?.pages, markAsReadMutation]);

  if (isLoading) {
    return <div>Loading notifications...</div>;
  }

  const notifications = data?.pages.flatMap((page) => page.items) ?? [];

  if (!notifications.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No notifications yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => {
        const Icon = NotificationIcon[notification.type];
        return (
          <Card key={notification._id.toString()}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={notification.data.user?.image} />
                  <AvatarFallback>{notification.data.user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm">{notification.data.message}</p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(new Date(notification.createdAt))}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {hasNextPage && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          <p className="text-muted-foreground">Loading more notifications...</p>
        </div>
      )}
    </div>
  );
}
