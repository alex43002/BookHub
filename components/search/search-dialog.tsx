'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { SearchResults } from './search-results';

interface SearchDialogProps {
  children?: React.ReactNode;
}

export function SearchDialog({ children }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const debouncedQuery = useDebounce(query, 300);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          {children || (
          <Button variant="outline" className="w-full justify-start">
            <Search className="mr-2 h-4 w-4" />
            <span>Search...</span>
          </Button>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search books, users, or posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10"
          />
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="books" className="flex-1">Books</TabsTrigger>
              <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
              <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
            </TabsList>
            <SearchResults query={debouncedQuery} type={activeTab} />
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}