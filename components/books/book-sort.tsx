'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sortOptions } from '@/lib/utils/sorting';

interface BookSortProps {
  onSortChange: (value: string) => void;
}

export function BookSort({ onSortChange }: BookSortProps) {
  return (
    <Select onValueChange={onSortChange} defaultValue="updated">
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}