'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus, BookOpen } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import { formatRelativeTime } from '@/lib/utils/date';

interface SearchResultsProps {
  query: string;
  type: string;
}

export function SearchResults({ query, type }: SearchResultsProps) {
  const utils = trpc.useContext();
  const { data: results, isLoading } = trpc.search.search.useQuery(
    { query, type: type as 'all' | 'books' | 'users' | 'posts' },
    { enabled: query.length >= 2 }
  );

  const follow = trpc.social.follow.useMutation({
    onSuccess: () => {
      utils.search.search.invalidate();
    },
  });

  if (!query || query.length < 2) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        Enter at least 2 characters to search
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        Searching...
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        No results found
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      {results.map((result) => {
        if ('name' in result) {
          // User result
          return (
            <Card key={result._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={result.image} />
                    <AvatarFallback>{result.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{result.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {result.email}
                    </p>
                  </div>
                </div>
                {!result.isFollowing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => follow.mutate({ followingId: result._id })}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Follow
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        }

        if ('title' in result) {
          // Book result
          return (
            <Card key={result._id}>
              <CardContent className="flex items-center gap-4 p-4">
                {result.coverImage && (
                  <img
                    src={result.coverImage}
                    alt={result.title}
                    className="h-16 w-12 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{result.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {result.author}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View
                </Button>
              </CardContent>
            </Card>
          );
        }

        // Share result
        return (
          <Card key={result._id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-2">
                <Avatar>
                  <AvatarImage src={result.user.image} />
                  <AvatarFallback>{result.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{result.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatRelativeTime(new Date(result.createdAt))}
                  </p>
                </div>
              </div>
              <p className="text-sm">{result.text}</p>
              {result.book && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {result.book.title}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}