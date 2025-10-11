import { Queue } from 'bullmq';
import { redisConnection } from './redis';

export const myQueue = new Queue('my-job-queue', { connection: redisConnection });
