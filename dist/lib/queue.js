import { Redis } from 'ioredis';
import { Queue } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();
export const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});
export const indexerQueue = new Queue('indexer-queue', { connection });
//# sourceMappingURL=queue.js.map