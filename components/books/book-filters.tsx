'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { BookSort } from './book-sort';

interface BookFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function BookFilters({ onSearchChange, onStatusChange, onSortChange }: BookFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search books..."
          className="pl-9"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select onValueChange={onStatusChange} defaultValue="ALL">
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Books</SelectItem>
          <SelectItem value="UNREAD">Unread</SelectItem>
          <SelectItem value="READING">Reading</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
        </SelectContent>
      </Select>
      <BookSort onSortChange={onSortChange} />
    </div>
  );
}