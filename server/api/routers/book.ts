import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import * as bookDb from '@/lib/db/books';
import { bookSchema } from '@/lib/validators/book';
import { searchBooks } from '@/lib/google-books';
import { TRPCError } from '@trpc/server';

export const bookRouter = router({
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return searchBooks(input.query);
    }),

  create: protectedProcedure
    .input(bookSchema)
    .mutation(async ({ input, ctx }) => {
      // Validate required fields
      if (!input.title || !input.author) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Title and author are required'
        });
      }

      // Ensure valid page numbers
      if (input.totalPages < 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Total pages must be at least 1'
        });
      }

      if (input.currentPage < 0 || input.currentPage > input.totalPages) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current page must be between 0 and total pages'
        });
      }

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