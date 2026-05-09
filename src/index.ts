import express from 'express';
import dotenv from 'dotenv';
import submitRoutes from './routes/submit.js';
import sitemapRoutes from './routes/sitemap.js';
import rssRoutes from './routes/rss.js';
import recentRoutes from './routes/recent.js';
import projectRoutes from './routes/project.js';
import signalPageRoutes from './routes/signalPage.js';
import './workers/indexerWorker.js'; // Initialize worker

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Serve the dashboard

// Routes
app.use('/submit', submitRoutes);
app.use('/projects', projectRoutes);
app.use('/v', signalPageRoutes); // Discovery signal pages
app.use('/sitemap.xml', sitemapRoutes);
app.use('/rss.xml', rssRoutes);
app.use('/recent-pages', recentRoutes);



app.get('/', (req, res) => {
  res.json({ 
    message: 'URL Indexer API is running',
    endpoints: {
      submit: 'POST /submit { urls: string[] }',
      sitemap: 'GET /sitemap.xml',
      rss: 'GET /rss.xml',
      recent: 'GET /recent-pages'
    }
  });
});

app.listen(PORT, () => {
  const domain = process.env.DOMAIN || `http://localhost:${PORT}`;
  console.log(`
🚀 Rocket Indexer Core is running!
🖥️ Dashboard: ${domain}
🌐 Public Domain: ${domain}
📄 Sitemap: ${domain}/sitemap.xml
xml RSS Feed: ${domain}/rss.xml
🧲 Recent Pages: ${domain}/recent-pages
  `);

});

