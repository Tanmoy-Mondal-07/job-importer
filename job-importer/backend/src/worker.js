require('dotenv').config();
const { jobQueue } = require('./queue');
const { connectMongo } = require('./db');
const Job = require('./models/Job');
const ImportLog = require('./models/ImportLog');

const concurrency = parseInt(process.env.WORKER_CONCURRENCY || '5', 10);

async function startWorker() {
    await connectMongo(process.env.MONGO_URI);

    console.log(`Worker started with concurrency ${concurrency}`);

    jobQueue.process(concurrency, async (bullJob) => {
        const data = bullJob.data;
        try {
            const query = {};
            if (data.guid) query.guid = data.guid;
            else if (data.link) query.link = data.link;
            else if (data.title) query.title = data.title;

            const update = {
                $set: {
                    title: data.title,
                    company: data.company,
                    location: data.location,
                    description: data.description,
                    pubDate: data.pubDate ? new Date(data.pubDate) : undefined,
                    raw: data.raw,
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    createdAt: new Date()
                }
            };

            const opts = { upsert: true, new: true, setDefaultsOnInsert: true };

            const existing = await Job.findOne(query).lean();

            if (!existing) {
                const created = await Job.create({
                    ...data,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                return { result: 'inserted', jobId: created._id.toString() };
            } else {
                await Job.updateOne({ _id: existing._id }, update);
                return { result: 'updated', jobId: existing._id.toString() };
            }
        } catch (err) {
            console.error('worker process error:', err);
            throw err;
        }
    });

    jobQueue.on('completed', (job, result) => {
        console.log(`Job ${job.id} completed:`, result);
    });

    jobQueue.on('failed', (job, err) => {
        console.error(`Job ${job.id} failed:`, err.message || err);
    });

    process.on('SIGINT', async () => {
        console.log('SIGINT received, closing worker');
        await jobQueue.close();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('SIGTERM received, closing worker');
        await jobQueue.close();
        process.exit(0);
    });
}

if (require.main === module) {
    startWorker().catch((e) => {
        console.error(e);
        process.exit(1);
    });
}

module.exports = { startWorker };