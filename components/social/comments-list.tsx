'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatRelativeTime } from '@/lib/utils/date';
import { trpc } from '@/lib/trpc/client';

interface CommentsListProps {
  shareId: string;
}

export function CommentsList({ shareId }: CommentsListProps) {
  const [comment, setComment] = useState('');
  const utils = trpc.useContext();
  const { data: comments, isLoading } = trpc.social.getComments.useQuery(shareId);

  const addComment = trpc.social.addComment.useMutation({
    onSuccess: () => {
      utils.social.getComments.invalidate(shareId);
      setComment('');
    },
  });

  if (isLoading) return <div>Loading comments...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={() => addComment.mutate({ shareId, text: comment })}
          disabled={!comment.trim()}
        >
          Post
        </Button>
      </div>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user.image} />
              <AvatarFallback>{comment.user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatRelativeTime(new Date(comment.createdAt))}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}