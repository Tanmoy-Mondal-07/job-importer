const { myQueue } = require('../lib/queue');

async function scheduleHourlyJob() {
  await myQueue.add(
    'fetchAndStoreAPI',
    {},
    { repeat: { cron: '0 * * * *' } } // Every hour
  );

  console.log('✅ Hourly job scheduled!');
}

scheduleHourlyJob().catch(console.error);
