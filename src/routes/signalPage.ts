import { Router } from 'express';
import { getSignalPage } from '../controllers/signalPageController.js';

const router = Router();

router.get('/:slug', getSignalPage);

export default router;
