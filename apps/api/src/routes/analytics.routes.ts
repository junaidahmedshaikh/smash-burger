import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/dashboard', authenticate, authorize('admin', 'manager'), AnalyticsController.getDashboard);

export default router;
