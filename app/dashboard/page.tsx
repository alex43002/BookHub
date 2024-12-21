'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BookList } from '@/components/books/book-list';
import { AddBookDialog } from '@/components/books/add-book-dialog';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Books</h1>
        <AddBookDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </AddBookDialog>
      </div>
      <BookList />
    </div>
  );
}