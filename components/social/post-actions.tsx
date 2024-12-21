'use client';

import { LikeButton } from './like-button';
import { CommentButton } from './comment-button';
import { ShareButton } from './share-button';

interface PostActionsProps {
  shareId: string;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onCommentClick: () => void;
}

export function PostActions({
  shareId,
  isLiked,
  likesCount,
  commentsCount,
  onCommentClick,
}: PostActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <LikeButton
        shareId={shareId}
        isLiked={isLiked}
        likesCount={likesCount}
      />
      <CommentButton
        commentsCount={commentsCount}
        onClick={onCommentClick}
      />
      <ShareButton shareId={shareId} />
    </div>
  );
}