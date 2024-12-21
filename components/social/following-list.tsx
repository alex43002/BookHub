'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserMinus } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import { formatDistanceToNow } from 'date-fns';

interface FollowingListProps {
  userId: string;
}

export function FollowingList({ userId }: FollowingListProps) {
  const { data: following, isLoading } = trpc.social.getFollowing.useQuery(userId);
  const utils = trpc.useContext();

  const unfollow = trpc.social.unfollow.useMutation({
    onSuccess: () => {
      utils.social.getFollowing.invalidate();
    },
  });

  if (isLoading) {
    return <div>Loading following...</div>;
  }

  if (!following?.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Not following anyone yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Follow other readers to see their updates in your feed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {following.map((follow) => (
        <Card key={follow._id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={follow.user.image} />
                <AvatarFallback>{follow.user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{follow.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  Following since{' '}
                  {formatDistanceToNow(new Date(follow.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => unfollow.mutate({ followingId: follow.user._id })}
            >
              <UserMinus className="mr-2 h-4 w-4" />
              Unfollow
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}