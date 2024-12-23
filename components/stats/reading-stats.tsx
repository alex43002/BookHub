'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc/client';
import { Book, Clock, BookOpen } from 'lucide-react';

export function ReadingStats() {
  const { data: stats, isLoading } = trpc.stats.overview.useQuery(undefined, {
    // Refresh data periodically
    refetchInterval: 30000,
    // Keep data fresh for 30 seconds
    staleTime: 30000
  });

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Books Read',
      value: `${stats.completedBooks} (${stats.currentlyReading} in progress)`,
      icon: Book,
      description: 'Total books completed',
    },
    {
      title: 'Pages Read',
      value: stats.totalPagesRead,
      icon: BookOpen,
      description: 'Total pages read',
    },
    {
      title: 'Reading Time',
      value: `${stats.totalReadingTime}m`,
      icon: Clock,
      description: `Avg. ${stats.averageReadingTime} minutes per session`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}