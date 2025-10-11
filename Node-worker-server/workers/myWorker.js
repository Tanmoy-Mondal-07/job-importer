const { Worker } = require('bullmq');
const { connection } = require('../lib/redis');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const { dbConnect } = require('../lib/mongo');
const Job = require('../models/Job');
const ImportLog = require('../models/ImportLog');

const worker = new Worker(
  'myQueue',
  async (job) => {
    console.log(`[${new Date().toISOString()}] Processing job ${job.id}`);

    await dbConnect();

    const apiUrl = 'https://jobicy.com/?feed=job_feed';
    const log = new ImportLog({
      source: apiUrl,
      fileName: 'jobs.xml',
    });

    try {
      // Fetch API
      const response = await axios.get(apiUrl, { responseType: 'text' });
      const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
      const jsonData = parser.parse(response.data);
      const channel = jsonData?.rss?.channel;

      if (!channel?.item) throw new Error('No items in feed');

      // Normalize items to always be an array
      let items = channel.item;
      if (!Array.isArray(items)) items = [items];

      log.totalFetched = items.length;

      for (const item of items) {
        try {
          // Upsert job (update if exists, create if not)
          const result = await Job.findOneAndUpdate(
            { externalId: item.guid }, // use guid as unique ID
            {
              source: apiUrl,
              externalId: item.guid,
              title: item.title,
              company: item.company || '',
              location: item.location || '',
              description: item.description,
              category: item.category || '',
              type: item.type || '',
              url: item.link,
              postedAt: item.pubDate ? new Date(item.pubDate) : undefined,
            },
            { upsert: true, new: true }
          );

          // Increment counters
          if (result) log.totalImported += 1;
        } catch (err) {
          log.failedJobs.push(item.guid || item.title || 'unknown');
        }
      }

      await log.save();
      console.log(`Job ${job.id} completed, fetched: ${log.totalFetched}, imported: ${log.totalImported}`);
    } catch (err) {
      console.error(`Job ${job.id} failed:`, err.message || err);
      log.failedJobs.push('API fetch failed');
      await log.save();
      throw err;
    }
  },
  { connection, concurrency: 3 }
);

worker.on('completed', (job) => console.log(`Job ${job.id} finished successfully`));
worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed`, err.message || err));