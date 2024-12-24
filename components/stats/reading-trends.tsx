'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

type TimeUnit = 'month' | 'day';

export function ReadingTrends() {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('month');
  const { data: trends, isLoading } = trpc.stats.trends.useQuery({ timeUnit });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Reading Trends</CardTitle>
            <Select value={timeUnit} onValueChange={(value: TimeUnit) => setTimeUnit(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="day">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          <div className="flex justify-between items-center">
            <CardTitle>Reading Trends</CardTitle>
            <Select value={timeUnit} onValueChange={(value: TimeUnit) => setTimeUnit(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="day">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
        <div className="flex justify-between items-center">
          <CardTitle>Reading Trends</CardTitle>
          <Select value={timeUnit} onValueChange={(value: TimeUnit) => setTimeUnit(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="day">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <XAxis
                dataKey="month"
                tickFormatter={(value) => format(new Date(value), timeUnit === 'month' ? 'MMM' : 'MMM d')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), timeUnit === 'month' ? 'MMMM yyyy' : 'MMMM d, yyyy')}
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