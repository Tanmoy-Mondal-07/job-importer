const axios = require('axios');
const { xmlToJson } = require('./utils/xmlToJson');
const { jobQueue } = require('./queue');

function normalizeItemsFromFeed(parsed) {
    if (!parsed) return [];
    if (parsed.rss && parsed.rss.channel) {
        const channel = parsed.rss.channel;
        const items = channel.item || [];
        return Array.isArray(items) ? items : [items];
    }
    if (parsed.feed && parsed.feed.entry) {
        const items = parsed.feed.entry;
        return Array.isArray(items) ? items : [items];
    }
    
    const keys = Object.keys(parsed);
    for (const k of keys) {
        if (Array.isArray(parsed[k])) return parsed[k];
    }
    return [];
}

async function pushFeedToQueue(feedUrl, opts = {}) {
    const res = await axios.get(feedUrl, { responseType: 'text', timeout: 20000 });
    const xml = res.data;
    const parsed = await xmlToJson(xml);
    const items = normalizeItemsFromFeed(parsed);

    const pushed = [];
    for (const item of items) {
        const jobData = {
            guid: item.guid?._ || item.guid || item.id || item.link || item.title,
            link: (item.link && (typeof item.link === 'string' ? item.link : item.link?.href)) || item.link,
            title: item.title,
            company: item.company || item['dc:creator'] || item['author']?.name || undefined,
            location: item.location || item['job_location'] || undefined,
            description: item.description || item.summary || item['content:encoded'] || undefined,
            pubDate: item.pubDate ? new Date(item.pubDate) : (item.published ? new Date(item.published) : undefined),
            raw: item,
            feedUrl
        };

        //bull queue
        const jobOptions = {
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 }
        };

        const queued = await jobQueue.add(jobData, jobOptions);
        pushed.push(queued.id);
    }

    return { total: items.length, pushed };
}

module.exports = { pushFeedToQueue, normalizeItemsFromFeed };