import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaMariaDb();

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
    adapter,
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
