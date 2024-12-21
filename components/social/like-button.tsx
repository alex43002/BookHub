'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc/client';

interface LikeButtonProps {
  shareId: string;
  isLiked: boolean;
  likesCount: number;
}

export function LikeButton({ shareId, isLiked, likesCount }: LikeButtonProps) {
  const utils = trpc.useContext();
  const toggleLike = trpc.social.toggleLike.useMutation({
    onSuccess: () => {
      utils.social.getFeed.invalidate();
    },
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={() => toggleLike.mutate({ shareId })}
    >
      <Heart
        className={cn(
          'h-4 w-4',
          isLiked && 'fill-current text-red-500'
        )}
      />
      {likesCount}
    </Button>
  );
}