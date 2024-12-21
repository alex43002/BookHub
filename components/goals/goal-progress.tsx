'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc/client';
import { Trophy } from 'lucide-react';

export function GoalProgress() {
  const { data: goal, isLoading } = trpc.readingGoal.getCurrentGoal.useQuery();

  if (isLoading) {
    return <div>Loading goal...</div>;
  }

  if (!goal) {
    return null;
  }

  const progress = Math.min(Math.round((goal.progress / goal.target) * 100), 100);
  const remaining = Math.max(goal.target - goal.progress, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Reading Goal</CardTitle>
        <Trophy className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
          <div className="text-sm text-muted-foreground">
            {remaining} {goal.type === 'BOOKS_PER_YEAR' ? 'books' : 
                       goal.type === 'PAGES_PER_DAY' ? 'pages' : 'minutes'} to go
          </div>
        </div>
      </CardContent>
    </Card>
  );
}