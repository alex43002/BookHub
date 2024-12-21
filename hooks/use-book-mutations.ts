'use client';

import { trpc } from '@/lib/trpc/client';
import { useToast } from '@/hooks/use-toast';

export function useBookMutations() {
  const utils = trpc.useContext();
  const { toast } = useToast();

  const deleteBook = trpc.book.delete.useMutation({
    onSuccess: () => {
      utils.book.list.invalidate();
      toast({
        title: 'Book deleted',
        description: 'The book has been removed from your library',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete book',
        variant: 'destructive',
      });
    },
  });

  return {
    deleteBook,
  };
}