import { Router } from 'express';
import { submitUrls } from '../controllers/submitController.js';
const router = Router();
router.post('/', submitUrls);
export default router;
//# sourceMappingURL=submit.js.map