import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { create } from 'xmlbuilder2';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.get('/', async (req, res) => {
  try {
    const urls = await prisma.url.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50, // Recent URLs for RSS
    });

    const domain = process.env.DOMAIN || 'http://localhost:3000';

    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('rss', { version: '2.0', 'xmlns:atom': 'http://www.w3.org/2005/Atom' })
        .ele('channel')
          .ele('title').txt('Recent Indexed URLs').up()
          .ele('link').txt(domain).up()
          .ele('description').txt('Latest URLs submitted for indexing').up()
          .ele('language').txt('en-us').up();

    urls.forEach((u) => {
      const item = root.ele('item');
      item.ele('title').txt(u.url).up();
      item.ele('link').txt(u.url).up();
      item.ele('guid').txt(u.id).up();
      item.ele('pubDate').txt(u.createdAt.toUTCString()).up();
    });

    const xml = root.end({ prettyPrint: true });

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('RSS error:', error);
    res.status(500).send('Error generating RSS feed');
  }
});

export default router;
