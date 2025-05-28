import { Router } from 'express';
import * as applyController from '../controllers/applyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, applyController.apply);

export default router;