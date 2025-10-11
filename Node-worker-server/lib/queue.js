const { Queue } = require('bullmq');
const { connection } = require('./redis');

const myQueue = new Queue('myQueue', {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  },
});

module.exports = { myQueue };