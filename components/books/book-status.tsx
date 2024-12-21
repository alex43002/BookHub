'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatBookStatus } from '@/lib/utils/book';
import type { BookStatus } from '@/lib/utils/book';

interface BookStatusBadgeProps {
  status: BookStatus;
  className?: string;
}

export function BookStatusBadge({ status, className }: BookStatusBadgeProps) {
  const variants = {
    UNREAD: 'bg-muted text-muted-foreground',
    READING: 'bg-primary text-primary-foreground',
    COMPLETED: 'bg-green-500 text-white',
  };

  return (
    <Badge className={cn(variants[status], className)}>
      {formatBookStatus(status)}
    </Badge>
  );
}