import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { IndexingCheckService } from '../services/indexingCheckService.js';

const indexingChecker = new IndexingCheckService();

export const verifyUrlIndexing = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const urlRecord = await prisma.url.findUnique({ where: { id } });
    if (!urlRecord) return res.status(404).json({ error: 'URL not found' });

    const isIndexed = await indexingChecker.isIndexed(urlRecord.url);

    const updated = await prisma.url.update({
      where: { id },
      data: {
        indexingStatus: isIndexed ? 'indexed' : 'not_indexed',
        lastIndexedAt: isIndexed ? new Date() : urlRecord.lastIndexedAt
      }
    });

    res.json({ isIndexed, url: updated });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
};
