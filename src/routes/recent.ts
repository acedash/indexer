import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const urls = await prisma.url.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recent Pages - URL Indexer</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 2rem; background: #f4f7f6; }
              h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem; }
              ul { list-style: none; padding: 0; }
              li { background: white; margin-bottom: 10px; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: transform 0.2s; }
              li:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
              a { text-decoration: none; color: #3498db; font-weight: 500; word-break: break-all; }
              .status { font-size: 0.8rem; padding: 2px 8px; border-radius: 12px; float: right; text-transform: uppercase; }
              .status-done { background: #d4edda; color: #155724; }
              .status-pending { background: #fff3cd; color: #856404; }
              .status-processing { background: #cce5ff; color: #004085; }
              .date { display: block; font-size: 0.75rem; color: #7f8c8d; margin-top: 5px; }
          </style>
      </head>
      <body>
          <h1>Recent Submitted URLs</h1>
          <p>This page acts as a crawl magnet for search engine bots.</p>
          <ul>
    `;

    urls.forEach((u) => {
      html += `
        <li>
          <span class="status status-${u.status}">${u.status}</span>
          <a href="${u.url}" target="_blank" rel="noopener">${u.url}</a>
          <span class="date">Submitted on: ${u.createdAt.toLocaleString()}</span>
        </li>
      `;
    });

    html += `
          </ul>
      </body>
      </html>
    `;

    res.header('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Recent pages error:', error);
    res.status(500).send('Error generating recent pages');
  }
});

export default router;
