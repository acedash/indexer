import express from 'express';
import dotenv from 'dotenv';
import submitRoutes from './routes/submit.js';
import sitemapRoutes from './routes/sitemap.js';
import rssRoutes from './routes/rss.js';
import recentRoutes from './routes/recent.js';
import projectRoutes from './routes/project.js';
import urlRoutes from './routes/url.js';
import signalPageRoutes from './routes/signalPage.js';
import './workers/indexerWorker.js'; // Initialize worker
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// Simple Admin Security Middleware
const adminAuth = (req, res, next) => {
    const password = req.headers['x-admin-password'] || req.query.admin_pw;
    if (process.env.ADMIN_PASSWORD && password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized: Admin password required' });
    }
    next();
};
app.use('/submit', submitRoutes); // API remains public with API Keys
app.use('/projects', adminAuth, projectRoutes);
app.use('/urls', adminAuth, urlRoutes);
app.use('/v', signalPageRoutes); // Discovery signal pages must be public
app.use('/sitemap.xml', sitemapRoutes);
app.use('/rss.xml', rssRoutes);
app.use('/recent', recentRoutes);
app.use(express.static('public')); // Serve the dashboard
app.get('/', (req, res) => {
    res.json({
        message: 'URL Indexer API is running',
        endpoints: {
            submit: 'POST /submit { urls: string[] }',
            sitemap: 'GET /sitemap.xml',
            rss: 'GET /rss.xml',
            recent: 'GET /recent'
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
🧲 Recent Pages: ${domain}/recent
  `);
});
//# sourceMappingURL=index.js.map