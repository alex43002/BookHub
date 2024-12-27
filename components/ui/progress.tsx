'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  className?: string;
  value: number;
  max?: number;
}

const Progress: React.FC<ProgressProps> = ({ className, value, max = 100 }) => {
  // Ensure value and max are numbers and within valid range
  const numericValue = Math.max(0, Math.min(max, value || 0));
  const percentage = (numericValue / max) * 100;

  return (
    <div
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
    >
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export { Progress };
