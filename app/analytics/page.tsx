'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReadingCalendar } from '@/components/analytics/reading-calendar';
import { ReadingHeatmap } from '@/components/analytics/reading-heatmap';
import { ReadingPace } from '@/components/analytics/reading-pace';
import { GenreDistribution } from '@/components/analytics/genre-distribution';
import { trpc } from '@/lib/trpc/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/error-boundary';
 
export default function AnalyticsPage() {
  const { data: stats, isLoading } = trpc.analytics.overview.useQuery();

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Reading Analytics</h1>
        
        <div className="grid gap-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <ErrorBoundary>
                  <ReadingCalendar />
                </ErrorBoundary>
                <ErrorBoundary>
                  <ReadingHeatmap />
                </ErrorBoundary>
              </div>
              <ErrorBoundary>
                <ReadingPace />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              <ErrorBoundary>
                <GenreDistribution />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
}