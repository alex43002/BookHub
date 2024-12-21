import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'PPP');
}

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}