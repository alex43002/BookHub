'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { BookSearchResults } from '@/components/books/book-search-results';

export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Discover Books</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books by title, author, or ISBN..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        
        {debouncedQuery && <BookSearchResults query={debouncedQuery} />}
      </div>
    </div>
  );
}