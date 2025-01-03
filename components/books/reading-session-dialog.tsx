'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Book } from '@/lib/types/book';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { readingSessionSchema, type ReadingSessionFormData } from '@/lib/validators/reading-session';
import { trpc } from '@/lib/trpc/client';

interface ReadingSessionDialogProps {
  children: React.ReactNode;
  book: Book;
}

export function ReadingSessionDialog({ children, book }: ReadingSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useContext();
  const form = useForm<ReadingSessionFormData>({
    resolver: zodResolver(readingSessionSchema),
    defaultValues: {
      startPage: book.currentPage,
      endPage: book.currentPage,
      duration: 30,
      date: new Date(),
    },
  });

  const addSession = trpc.readingSession.create.useMutation({
    onSuccess: () => {
      // Invalidate all affected queries
      utils.book.get.invalidate(book.id);
      utils.readingSession.list.invalidate();
      utils.stats.overview.invalidate();
      utils.stats.trends.invalidate();
      utils.analytics.overview.invalidate();
      setOpen(false);
      form.reset();
    },
    onMutate: async (newSession) => {
      // Cancel outgoing stats fetches
      await utils.stats.overview.cancel();
      const previousStats = utils.stats.overview.getData();
    
      // Optimistically update stats
      utils.stats.overview.setData(undefined, (old) => {
        // Ensure all fields are explicitly defined
        const totalPagesRead = (old?.totalPagesRead || 0) + (newSession.endPage - newSession.startPage);
        const totalReadingTime = (old?.totalReadingTime || 0) + newSession.duration;
    
        // Maintain structure while explicitly providing defaults
        return {
          totalPagesRead,
          totalReadingTime,
          completedBooks: old?.completedBooks || 0,
          currentlyReading: old?.currentlyReading || 0,
          averageReadingTime: old?.averageReadingTime || 0,
        };
      });
    
      return { previousStats };
    },
    
    onError: (err, newSession, context) => {
      // Rollback on error
      if (context?.previousStats) {
        utils.stats.overview.setData(undefined, context.previousStats);
      }
    },
  });

  const onSubmit = (data: ReadingSessionFormData) => {
    addSession.mutate({
      bookId: book.id,
      ...data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Reading Session</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startPage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Page</FormLabel>
                  <FormControl>
                    <div className="text-sm text-muted-foreground mb-1">Current page: {book.currentPage}</div>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endPage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Page</FormLabel>
                  <FormControl>
                    <div className="text-sm text-muted-foreground mb-1">Total pages: {book.totalPages}</div>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <div className="text-sm text-muted-foreground mb-1">Time spent reading</div>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Session</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}