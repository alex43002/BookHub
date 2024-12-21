'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export function ReadingTrends() {
  const { data: trends, isLoading } = trpc.stats.trends.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reading Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading trends...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trends?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reading Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No reading data available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <XAxis
                dataKey="month"
                tickFormatter={(value) => format(new Date(value), 'MMM')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'MMMM yyyy')}
                formatter={(value: number) => [`${value} pages`, 'Pages Read']}
              />
              <Line
                type="monotone"
                dataKey="pagesRead"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}