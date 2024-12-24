import { ReadingSession, ReadingSessionStats } from '@/lib/types/reading-session';
import { format } from 'date-fns';

export function calculateSessionStats(session: ReadingSession): ReadingSessionStats {
  const pagesRead = session.endPage - session.startPage;
  const readingSpeed = Math.round((pagesRead / session.duration) * 60); // pages per hour
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return {
    pagesRead,
    readingSpeed,
    formattedDate: format(session.date, 'MMM d, yyyy'),
    formattedTime: format(session.date, 'h:mm a'),
    timezone,
  };
}