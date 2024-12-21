import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc/server';
import { readingSessionSchema } from '@/lib/validators/reading-session';
import { prisma } from '@/lib/prisma';

export const readingSessionRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        startPage: z.number(),
        endPage: z.number(),
        duration: z.number(),
        date: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const session = await prisma.readingSession.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });

      // Update book's current page
      await prisma.book.update({
        where: {
          id: input.bookId,
          userId: ctx.user.id,
        },
        data: {
          currentPage: input.endPage,
          status: input.endPage === 0 ? 'UNREAD' :
                 input.endPage >= (await prisma.book.findUnique({
                   where: { id: input.bookId },
                   select: { totalPages: true },
                 }))!.totalPages ? 'COMPLETED' : 'READING',
        },
      });

      return session;
    }),

  list: protectedProcedure
    .input(
      z.object({
        bookId: z.string().optional(),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      return prisma.readingSession.findMany({
        where: {
          userId: ctx.user.id,
          ...(input?.bookId ? { bookId: input.bookId } : {}),
        },
        orderBy: {
          date: 'desc',
        },
        include: {
          book: true,
        },
      });
    }),
});