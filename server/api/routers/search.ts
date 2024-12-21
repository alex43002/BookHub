import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import * as searchDb from '@/lib/db/search';

export const searchRouter = router({
  search: protectedProcedure
    .input(z.object({
      query: z.string(),
      type: z.enum(['all', 'books', 'users', 'posts']),
    }))
    .query(async ({ input, ctx }) => {
      const { query, type } = input;

      if (type === 'users' || type === 'all') {
        const users = await searchDb.searchUsers(query, ctx.user.id);
        if (type === 'users') return users;
      }

      if (type === 'books' || type === 'all') {
        const books = await searchDb.searchBooks(query, ctx.user.id);
        if (type === 'books') return books;
      }

      if (type === 'posts' || type === 'all') {
        const shares = await searchDb.searchShares(query, ctx.user.id);
        if (type === 'posts') return shares;
      }

      // For 'all' type, combine and sort results
      const [users, books, shares] = await Promise.all([
        searchDb.searchUsers(query, ctx.user.id),
        searchDb.searchBooks(query, ctx.user.id),
        searchDb.searchShares(query, ctx.user.id),
      ]);

      return [...users, ...books, ...shares].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }),
});