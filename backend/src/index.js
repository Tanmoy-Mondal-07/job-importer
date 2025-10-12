require('dotenv').config();
const express = require('express');
const { connectMongo } = require('./db');
const { pushFeedToQueue } = require('./producer');
const { jobQueue } = require('./queue');
const ImportLog = require('./models/ImportLog');

const PORT = process.env.PORT || 4000;

async function startServer() {
    await connectMongo(process.env.MONGO_URI);

    const app = express();
    app.use(express.json());

    //is the server running
    app.get('/', (req, res) => res.send('Job importer running'));

    // taster rout
    app.post("/import", async (req, res) => {
        try {
            const feedUrl = req.body.feedUrl || process.env.FEEDS?.split(",")[0];
            if (!feedUrl) return res.status(400).send({ error: "feedUrl required" });

            const start = Date.now();
            const pushRes = await pushFeedToQueue(feedUrl);
            const jobIds = pushRes.pushed;
            const totalFetched = pushRes.total || jobIds.length;

            console.log(` Added ${jobIds.length} jobs to queue for ${feedUrl}`);

            const results = {
                totalFetched,
                totalImported: 0,
                newJobs: 0,
                updatedJobs: 0,
                failedJobs: [],
            };

            //bull queue
            const pollInterval = 2000;
            let remaining = new Set(jobIds);
            let maxWaitMs = 1000 * 60 * 2;
            const started = Date.now();

            while (remaining.size > 0 && Date.now() - started < maxWaitMs) {
                for (const id of [...remaining]) {
                    const job = await jobQueue.getJob(id);
                    if (!job) {
                        remaining.delete(id);
                        continue;
                    }
                    if (await job.isCompleted()) {
                        const r = await job.returnvalue;
                        results.totalImported += 1;
                        if (r?.result === "inserted") results.newJobs += 1;
                        else if (r?.result === "updated") results.updatedJobs += 1;
                        remaining.delete(id);
                    } else if (await job.isFailed()) {
                        const err = await job.failedReason;
                        results.failedJobs.push({ item: null, reason: err });
                        remaining.delete(id);
                    }
                }
                if (remaining.size > 0) {
                    console.log(`⏳ Waiting for ${remaining.size} jobs...`);
                    await new Promise((r) => setTimeout(r, pollInterval));
                }
            }

            //timed out if stuck
            if (remaining.size > 0) {
                console.log(`${remaining.size} jobs timed out`);
                for (const id of remaining) {
                    results.failedJobs.push({ item: null, reason: "timeout" });
                }
            }

            const durationMs = Date.now() - start;
            const importLog = await ImportLog.create({
                feedUrl,
                fileName: feedUrl,
                timestamp: new Date(),
                totalFetched: results.totalFetched,
                totalImported: results.totalImported,
                newJobs: results.newJobs,
                updatedJobs: results.updatedJobs,
                failedJobs: results.failedJobs,
                durationMs,
            });

            return res.json({ ok: true, importLog });
        } catch (err) {
            console.error("import endpoint error :: ", err);
            return res.status(500).json({ error: err.message || String(err) });
        }
    });

    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    });
}

if (require.main === module) {
    startServer().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}