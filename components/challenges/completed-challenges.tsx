'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc/client';
import { Trophy, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function CompletedChallenges() {
  const { data: challenges, isLoading } = trpc.challenges.getCompleted.useQuery();

  if (isLoading) {
    return <div>Loading completed challenges...</div>;
  }

  if (!challenges?.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No completed challenges yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Complete your active challenges to see them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {challenges.map((challenge) => (
        <Card key={challenge._id.toString()}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-base">
                {challenge.description}
              </CardTitle>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Completed on{' '}
                  {format(new Date(challenge.completedAt!), 'PPP')}
                </span>
              </div>
            </div>
            <Badge variant="secondary">
              <Trophy className="mr-2 h-4 w-4" />
              Completed
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Target: {challenge.target} {challenge.type.toLowerCase().replace('_', ' ')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}