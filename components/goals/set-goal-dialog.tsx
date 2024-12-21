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
import { readingGoalSchema } from '@/lib/validators/reading-goal';
import { trpc } from '@/lib/trpc/client';

interface SetGoalDialogProps {
  children: React.ReactNode;
}

export function SetGoalDialog({ children }: SetGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useContext();
  const form = useForm({
    resolver: zodResolver(readingGoalSchema),
    defaultValues: {
      type: 'BOOKS_PER_YEAR',
      target: 12,
      startDate: new Date(),
      endDate: new Date(new Date().getFullYear(), 11, 31),
    },
  });

  const addGoal = trpc.readingGoal.create.useMutation({
    onSuccess: () => {
      utils.readingGoal.getCurrentGoal.invalidate();
      setOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: any) => {
    addGoal.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Reading Goal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BOOKS_PER_YEAR">Books per Year</SelectItem>
                      <SelectItem value="PAGES_PER_DAY">Pages per Day</SelectItem>
                      <SelectItem value="MINUTES_PER_DAY">Minutes per Day</SelectItem>
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
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Set Goal</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}