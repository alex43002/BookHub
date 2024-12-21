'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { challengeSchema, type ChallengeFormData } from '@/lib/validators/challenge';
import { trpc } from '@/lib/trpc/client';
import { addMonths } from 'date-fns';

interface CreateChallengeDialogProps {
  children: React.ReactNode;
}

export function CreateChallengeDialog({ children }: CreateChallengeDialogProps) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useContext();

  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      type: 'BOOKS_IN_TIME',
      target: 1,
      timeframe: 'MONTH',
      startDate: new Date(),
      endDate: addMonths(new Date(), 1),
      description: '',
    },
  });

  const createChallenge = trpc.challenges.create.useMutation({
    onSuccess: () => {
      utils.challenges.getActive.invalidate();
      setOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: ChallengeFormData) => {
    createChallenge.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Challenge</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenge Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select challenge type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BOOKS_IN_TIME">Books in Time</SelectItem>
                      <SelectItem value="PAGES_IN_TIME">Pages in Time</SelectItem>
                      <SelectItem value="READING_STREAK">Reading Streak</SelectItem>
                      <SelectItem value="GENRE_EXPLORER">Genre Explorer</SelectItem>
                      <SelectItem value="COMPLETION_RATE">Completion Rate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target</FormLabel>
                  <FormControl>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
              <Button type="submit">Create Challenge</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}