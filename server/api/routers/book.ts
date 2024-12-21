import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import { BookService } from '@/lib/services/book';
import { bookSchema } from '@/lib/validators/book';

const bookService = new BookService();

export const bookRouter = router({
  create: protectedProcedure
    .input(bookSchema)
    .mutation(async ({ input, ctx }) => {
      return bookService.createBook(ctx.user.id, input);
    }),

  get: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return bookService.getBook(input, ctx.user.id);
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: bookSchema.partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      return bookService.updateBook(input.id, ctx.user.id, input.data);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return bookService.deleteBook(input, ctx.user.id);
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      return bookService.listBooks(ctx.user.id);
    }),
});