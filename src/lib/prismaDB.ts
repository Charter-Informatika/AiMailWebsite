import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let adapter: any = undefined;
try {
  const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
  const dbUrl = process.env.DATABASE_URL || '';
  adapter = new PrismaMariaDb(dbUrl);
} catch (err) {
  console.warn('Could not load @prisma/adapter-mariadb:', err?.message || err);
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    ...(adapter ? { adapter } : {}),
  });

// Surface Prisma client events for better diagnostics
prisma.$on('info', (e) => console.info('[Prisma][info]', e));
prisma.$on('warn', (e) => console.warn('[Prisma][warn]', e));
prisma.$on('error', (e) => console.error('[Prisma][error]', e));

// Attempt to connect early so failures are visible and don't cause pool timeouts later
(async () => {
  try {
    await prisma.$connect();
    console.info('[Prisma] connected to database');
  } catch (err) {
    console.error('[Prisma] $connect failed:', err);
  }
})();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
