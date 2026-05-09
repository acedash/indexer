import { Router } from 'express';
import { create } from 'xmlbuilder2';
import prisma from '../lib/prisma.js';
const router = Router();
router.get('/', async (req, res) => {
    const domain = process.env.DOMAIN || 'http://localhost:3000';
    try {
        const urls = await prisma.url.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        const feed = {
            rss: {
                '@version': '2.0',
                channel: {
                    title: 'Rocket Indexer - Latest Signals',
                    link: domain,
                    description: 'High-speed discovery signals for search engine bots',
                    item: urls.map((u) => ({
                        title: `Index Signal: ${u.url}`,
                        link: u.url,
                        guid: u.id,
                        pubDate: u.createdAt.toUTCString(),
                    })),
                },
            },
        };
        const xml = create(feed).end({ prettyPrint: true });
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    }
    catch (error) {
        res.status(500).send('Error generating RSS feed');
    }
});
export default router;
//# sourceMappingURL=rss.js.map