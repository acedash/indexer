import { PrismaClient } from '@prisma/client';

// Prisma 7 requires at least an empty object to initialize correctly on some environments
const prisma = new PrismaClient({});

export default prisma;
