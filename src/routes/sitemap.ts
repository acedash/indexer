import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { create } from 'xmlbuilder2';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const urls = await prisma.url.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50000, // Sitemap limit
    });

    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

    urls.forEach((u) => {
      const urlEle = root.ele('url');
      urlEle.ele('loc').txt(u.url);
      urlEle.ele('lastmod').txt(u.updatedAt.toISOString());
      urlEle.ele('changefreq').txt('daily');
      urlEle.ele('priority').txt('0.8');
    });

    const xml = root.end({ prettyPrint: true });

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
