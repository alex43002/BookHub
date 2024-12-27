'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { trpc } from '@/lib/trpc/client';
import { Trophy, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ActiveChallenges() {
  const { data: challenges, isLoading } = trpc.challenges.getActive.useQuery();

  if (isLoading) {
    return <div>Loading challenges...</div>;
  }

  if (!challenges?.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No active challenges.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create a new challenge to start tracking your reading goals.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {challenges.map((challenge) => {
        const progress = Math.round((challenge.progress / challenge.target) * 100);
        const remaining = challenge.target - challenge.progress;

        return (
          <Card key={challenge._id.toString()}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {challenge.description}
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress || 0} max={100} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>
                      Ends {formatDistanceToNow(new Date(challenge.endDate), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {remaining} to go
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}