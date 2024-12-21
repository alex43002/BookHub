'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

export function ReadingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: sessions } = trpc.analytics.dailySessions.useQuery(
    date ? { date } : undefined
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          modifiers={{
            reading: sessions?.map(s => new Date(s.date)) || [],
          }}
          modifiersStyles={{
            reading: { backgroundColor: 'hsl(var(--primary))' },
          }}
        />
        {date && sessions && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">
              {date.toLocaleDateString(undefined, { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h4>
            <div className="space-y-2">
              {sessions.map(session => (
                <div key={session.id} className="text-sm">
                  {session.bookTitle}: {session.duration} minutes
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}