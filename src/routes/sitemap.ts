import { Router } from 'express';
import { create } from 'xmlbuilder2';
import prisma from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  const domain = process.env.DOMAIN || 'http://localhost:3000';

  try {
    const urls = await prisma.url.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 500,
    });

    const signalPages = await prisma.signalPage.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 500,
    });

    const sitemap = {
      urlset: {
        '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        url: [
          {
            loc: domain,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'always',
            priority: '1.0',
          },
          {
            loc: `${domain}/recent`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'always',
            priority: '0.9',
          },
          ...signalPages.map((p: any) => ({
            loc: `${domain}/v/${p.slug}`,
            lastmod: p.updatedAt.toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.7',
          })),
          ...urls.map((u: any) => ({
            loc: u.url,
            lastmod: u.updatedAt.toISOString().split('T')[0],
            changefreq: 'daily',
            priority: '0.6',
          })),
        ],
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
