const Queue = require('bull');
const dotenv = require('dotenv');
dotenv.config();

const queueName = process.env.QUEUE_NAME || 'job_import_queue';

const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};

if (process.env.REDIS_PASSWORD) {
    redisConfig.password = process.env.REDIS_PASSWORD;
}

const jobQueue = new Queue(queueName, { redis: redisConfig });

jobQueue.on('error', (err) => {
    console.error('Bull queue error', err);
});

jobQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err.message || err);
});

module.exports = { jobQueue };