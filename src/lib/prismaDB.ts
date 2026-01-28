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
    log: ['query'],
    ...(adapter ? { adapter } : {}),
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
