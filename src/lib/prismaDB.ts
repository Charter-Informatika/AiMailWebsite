import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const dbUrl = process.env.DATABASE_URL || '';

let adapter: any = undefined;
if (dbUrl.toLowerCase().includes('maria')) {
  try {
    const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
    adapter = new PrismaMariaDb(dbUrl);
  } catch (err) {
    console.warn('Could not load @prisma/adapter-mariadb:', err?.message || err);
  }
}

export const prisma =
  globalForPrisma.prisma ||
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

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
