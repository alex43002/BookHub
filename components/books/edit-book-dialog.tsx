'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TRPCClientError } from '@trpc/client';
import { Button } from '@/components/ui/button';
import { Book } from '@/lib/types/book';
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
import { bookSchema, type BookFormData } from '@/lib/validators/book';
import { trpc } from '@/lib/trpc/client';

interface EditBookDialogProps {
  children: React.ReactNode;
  book: Book;
}

export function EditBookDialog({ children, book }: EditBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utils = trpc.useContext();
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      coverImage: book.coverImage || '',
      totalPages: book.totalPages,
      currentPage: book.currentPage,
      status: book.status,
    },
  });

  const editBook = trpc.book.update.useMutation({
    onSuccess: () => {
      utils.book.list.invalidate();
      setError(null);
      setOpen(false);
    },
    onError: (err) => {
      if (err instanceof TRPCClientError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  });

  const onSubmit = (data: BookFormData) => {
    setError(null);
    editBook.mutate({ id: book.id, data });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="mb-4 p-2 text-sm text-destructive bg-destructive/10 rounded">
            {error}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Page</FormLabel>
                  <div className="text-sm text-muted-foreground mb-1">Total pages: {book.totalPages}</div>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max={book.totalPages}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  {field.value > book.totalPages && (
                    <p className="text-sm text-destructive mt-1">
                      Cannot exceed total pages ({book.totalPages})
                    </p>
                  )}
                  {field.value < 0 && (
                    <p className="text-sm text-destructive mt-1">
                      Page number cannot be negative
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UNREAD">Unread</SelectItem>
                      <SelectItem value="READING">Reading</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
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
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}