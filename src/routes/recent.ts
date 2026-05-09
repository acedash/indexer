import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const urls = await prisma.url.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    if (req.headers.accept?.includes('application/json')) {
      return res.json(urls.map((u: any) => ({
        id: u.id,
        url: u.url,
        status: u.status,
        indexingStatus: u.indexingStatus,
        updatedAt: u.updatedAt
      })));
    }

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recent Indexing Activity</title>
        <style>
          body { font-family: sans-serif; padding: 20px; background: #f4f4f9; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          ul { list-style: none; padding: 0; }
          li { padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
          .url { font-weight: bold; color: #0066cc; }
          .status { font-size: 0.8em; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
          .status-pending { background: #fff3cd; color: #856404; }
          .status-processing { background: #d1ecf1; color: #0c5460; }
          .status-done { background: #d4edda; color: #155724; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Recent Indexing Signal Activity</h1>
          <ul>
    `;

    urls.forEach((u: any) => {
      html += `
        <li>
          <span class="url">${u.url}</span>
          <span class="status status-${u.status}">${u.status}</span>
        </li>
      `;
    });

    html += `
          </ul>
        </div>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).send('Error loading recent activity');
  }
});

export default router;
