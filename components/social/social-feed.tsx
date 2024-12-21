'use client';

import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/date';
import { trpc } from '@/lib/trpc/client';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { ShareDialog } from './share-dialog';
import { PostActions } from './post-actions';
import { CommentsList } from './comments-list';

import Image from 'next/image';
export function SocialFeed() {
  const {
    data: feed,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = trpc.social.getFeed.useInfiniteQuery(
    { limit: 10 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const loadMoreRef = useInfiniteScroll(
    () => fetchNextPage(),
    !!hasNextPage,
    isFetchingNextPage
  );

  if (isLoading) {
    return <div>Loading feed...</div>;
  }

  const posts = feed?.pages.flatMap((page) => page.items) ?? [];

  if (!posts.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No posts in your feed yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Follow other readers or share your reading progress to see updates here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ShareDialog>
          <Button>
            <Share className="mr-2 h-4 w-4" />
            Share Update
          </Button>
        </ShareDialog>
      </div>

      {posts.map((share) => (
        <Card key={share._id}>
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={share.user.image} />
                <AvatarFallback>{share.user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {share.user.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatRelativeTime(new Date(share.createdAt))}
                </p>
              </div>
            </div>
            <p>{share.text}</p>
            {share.book && (
              <div className="flex items-center space-x-4 bg-muted p-4 rounded-lg">
                {share.book.coverImage && (
                  <Image
                    src={share.book.coverImage}
                    alt={share.book.title}
                    width={64}
                    height={96}
                    className="w-16 h-24 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{share.book.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {share.book.author}
                  </p>
                </div>
              </div>
            )}
          </CardHeader>
          <CardFooter className="flex-col gap-4">
            <PostActions
              shareId={share._id}
              isLiked={share.isLiked}
              likesCount={share.likesCount}
              commentsCount={share.commentsCount}
              onCommentClick={() => {}}
            />
            <CommentsList shareId={share._id} />
          </CardFooter>
        </Card>
      ))}
      {hasNextPage && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          <p className="text-muted-foreground">Loading more posts...</p>
        </div>
      )}
    </div>
  );
}