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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { shareSchema, type ShareFormData } from '@/lib/validators/social';
import { trpc } from '@/lib/trpc/client';

interface ShareDialogProps {
  children: React.ReactNode;
}

export function ShareDialog({ children }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useContext();
  const { data: books } = trpc.book.list.useQuery();

  const form = useForm<ShareFormData>({
    resolver: zodResolver(shareSchema),
    defaultValues: {
      text: '',
      visibility: 'PUBLIC',
    },
  });

  const share = trpc.social.share.useMutation({
    onSuccess: () => {
      utils.social.getFeed.invalidate();
      setOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: ShareFormData) => {
    share.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Reading Update</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bookId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a book" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {books?.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="FOLLOWERS">Followers Only</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button type="submit">Share</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}