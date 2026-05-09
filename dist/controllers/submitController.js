import prisma from '../lib/prisma.js';
import { indexerQueue } from '../lib/queue.js';
import { pingSearchEngines } from '../services/pingService.js';
export const submitUrls = async (req, res) => {
    // Accept either { urls: [..] } or a single { url: "..." }
    let urls = req.body.urls;
    const singleUrl = req.body.url;
    const apiKey = req.headers['x-api-key'];
    if (!urls && typeof singleUrl === "string") {
        urls = [singleUrl];
    }
    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: "Please provide an array of URLs or a single 'url' field" });
    }
    try {
        let project = null;
        if (apiKey) {
            project = await prisma.project.findUnique({
                where: { apiKey },
            });
        }
        const results = [];
        for (const url of urls) {
            // 1. Save/Update in DB
            const dbUrl = await prisma.url.upsert({
                where: { url },
                update: {
                    status: 'pending',
                    updatedAt: new Date(),
                    projectId: project?.id || null
                },
                create: {
                    url,
                    status: 'pending',
                    projectId: project?.id || null
                },
            });
            // 2. Add to Queue
            await indexerQueue.add('index-url', { urlId: dbUrl.id, url: dbUrl.url });
            results.push(dbUrl);
        }
        // 3. Trigger Global Sitemap Ping (Discovery Boost)
        const domain = process.env.DOMAIN || 'http://localhost:3000';
        pingSearchEngines(`${domain}/sitemap.xml`).catch(e => console.warn('Global sitemap ping failed:', e.message));
        res.status(201).json({
            message: `${urls.length} URLs submitted successfully`,
            project: project ? project.name : 'Default',
            data: results,
        });
    }
    catch (error) {
        console.error('Error submitting URLs:', error);
        res.status(500).json({ error: 'Failed to submit URLs' });
    }
};
//# sourceMappingURL=submitController.js.map