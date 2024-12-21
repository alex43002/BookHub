'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import { formatDistanceToNow } from 'date-fns';

interface FollowersListProps {
  userId: string;
}

export function FollowersList({ userId }: FollowersListProps) {
  const { data: followers, isLoading } = trpc.social.getFollowers.useQuery(userId);
  const utils = trpc.useContext();

  const follow = trpc.social.follow.useMutation({
    onSuccess: () => {
      utils.social.getFollowers.invalidate();
      utils.social.getFollowing.invalidate();
    },
  });

  if (isLoading) {
    return <div>Loading followers...</div>;
  }

  if (!followers?.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No followers yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Share your reading journey to attract followers.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {followers.map((follower) => (
        <Card key={follower._id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={follower.user.image} />
                <AvatarFallback>{follower.user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{follower.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  Following since{' '}
                  {formatDistanceToNow(new Date(follower.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => follow.mutate({ followingId: follower.user._id })}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Follow Back
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}