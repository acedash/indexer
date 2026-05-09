import { Router } from 'express';
import { create } from 'xmlbuilder2';
import prisma from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  const domain = process.env.DOMAIN || 'http://localhost:3000';

  try {
    const urls = await prisma.url.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 1000,
    });

    const sitemap = {
      urlset: {
        '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        url: urls.map((u: any) => ({
          loc: u.url,
          lastmod: u.updatedAt.toISOString().split('T')[0],
          changefreq: 'daily',
          priority: '0.8',
        })),
      },
    };

    const xml = create(sitemap).end({ prettyPrint: true });
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
