'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface CommentButtonProps {
  commentsCount: number;
  onClick: () => void;
}

export function CommentButton({ commentsCount, onClick }: CommentButtonProps) {
  return (
    <Button variant="ghost" size="sm" className="gap-2" onClick={onClick}>
      <MessageCircle className="h-4 w-4" />
      {commentsCount}
    </Button>
  );
}