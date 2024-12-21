import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import * as bookDb from '@/lib/db/books';
import { bookSchema } from '@/lib/validators/book';
import { searchBooks } from '@/lib/google-books';

export const bookRouter = router({
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return searchBooks(input.query);
    }),

  create: protectedProcedure
    .input(bookSchema)
    .mutation(async ({ input, ctx }) => {
      return bookDb.createBook(ctx.user.id, input);
    }),

  get: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return bookDb.getBook(input, ctx.user.id);
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: bookSchema.partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      return bookDb.updateBook(input.id, ctx.user.id, input.data);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return bookDb.deleteBook(input, ctx.user.id);
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      return bookDb.listBooks(ctx.user.id);
    }),
});