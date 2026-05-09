import { Router } from 'express';
import { verifyUrlIndexing } from '../controllers/urlController.js';

const router = Router();

router.post('/:id/verify', verifyUrlIndexing);

export default router;
