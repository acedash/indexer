import { Worker, Job } from 'bullmq';
import { connection } from '../lib/queue.js';
import prisma from '../lib/prisma.js';
import { pingSearchEngines } from '../services/pingService.js';
import { GoogleIndexingService } from '../services/googleIndexingService.js';
import { IndexingCheckService } from '../services/indexingCheckService.js';
import dotenv from 'dotenv';

dotenv.config();

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const indexingChecker = new IndexingCheckService();

const worker = new Worker(
  'indexer-queue',
  async (job: Job) => {
    const { urlId, url } = job.data;
    const domain = process.env.DOMAIN || 'http://localhost:3000';

    console.log(`🚀 Starting Rocket Indexing Core for: ${url}`);

    try {
      // 1. Fetch URL with project context
      const urlRecord = await prisma.url.findUnique({
        where: { id: urlId },
        include: { project: true },
      });

      if (!urlRecord) throw new Error('URL not found in database');

      // 2. Assign to a Discovery Signal Page (The "Referral" trick)
      // We look for a signal page created in the last 1 hour that has < 50 URLs
      let signalPage = await prisma.signalPage.findFirst({
        where: {
          createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
          urls: { some: {} } // Just a placeholder, we'll check count manually
        },
        include: { _count: { select: { urls: true } } }
      });

      if (!signalPage || signalPage._count.urls >= 50) {
        signalPage = await prisma.signalPage.create({
          data: { slug: `signal-${Math.random().toString(36).substring(2, 10)}` },
          include: { _count: { select: { urls: true } } }
        });
      }

      await prisma.url.update({
        where: { id: urlId },
        data: { 
          status: 'processing',
          signalPageId: signalPage.id
        },
      });

      const signalPageUrl = `${domain}/v/${signalPage.slug}`;

      // Initialize Google Indexing if key is available
      let googleIndexer: GoogleIndexingService | null = null;
      const googleKey = urlRecord.project?.googleServiceAccount || process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

      if (googleKey) {
        try {
          const credentials = typeof googleKey === 'string' ? JSON.parse(googleKey) : googleKey;
          googleIndexer = new GoogleIndexingService(credentials);
        } catch (e) {
          console.warn('Failed to initialize Google Indexing Service:', e);
        }
      }


      const signals = [
        { label: 'Signal 1 (Instant)', waitTime: 30 * 1000 },
        { label: 'Signal 2 (Short)', waitTime: 2 * 60 * 1000 },
        { label: 'Signal 3 (Final)', waitTime: 0 },
      ];

      for (const signal of signals) {
        console.log(`[${signal.label}] Blasting signals for ${url}...`);
        
        const pings = [
          pingSearchEngines(url), // Ping the target URL
          pingSearchEngines(signalPageUrl), // Ping the discovery page
          pingSearchEngines(`${domain}/sitemap.xml`) // Ping the sitemap
        ];

        // The "Rocket" Core: Submit the DISCOVERY page to Google Indexing API
        // This forces Google to crawl our page, which contains the backlink.
        if (googleIndexer) {
          pings.push(googleIndexer.notify(signalPageUrl) as any);
          pings.push(googleIndexer.notify(url) as any); // Also try target directly
        }
        
        await Promise.allSettled(pings);


        if (signal.waitTime > 0) {
          await wait(signal.waitTime);
        }
      }

      // Verification Step
      console.log(`Verifying indexing status for ${url}...`);
      const isIndexed = await indexingChecker.isIndexed(url);

      
      await prisma.url.update({
        where: { id: urlId },
        data: { 
          status: 'done',
          indexingStatus: isIndexed ? 'indexed' : 'not_indexed',
          lastIndexedAt: isIndexed ? new Date() : null
        },
      });

      console.log(`Finished processing: ${url} (Indexed: ${isIndexed})`);
    } catch (error) {

      console.error(`Error processing job ${job.id}:`, error);
      await prisma.url.update({
        where: { id: urlId },
        data: { 
          status: 'failed',
          retryCount: { increment: 1 }
        },
      });
      throw error;
    }
  },
  { connection }
);


worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});

export default worker;
