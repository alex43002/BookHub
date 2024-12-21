'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc/client';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';

export function ReadingHeatmap() {
  const { data: heatmap } = trpc.analytics.readingHeatmap.useQuery();

  if (!heatmap?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="category" dataKey="day" name="Day" />
              <YAxis type="category" dataKey="hour" name="Hour" />
              <ZAxis type="number" dataKey="value" range={[50, 500]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={heatmap} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}