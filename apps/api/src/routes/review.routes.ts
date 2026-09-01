import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createReviewSchema } from '@smashd/validation';

const router = Router();

router.get('/product/:productId', ReviewController.getProductReviews);
router.post('/', authenticate, validateBody(createReviewSchema), ReviewController.createReview);
router.get('/', authenticate, authorize('admin', 'manager'), ReviewController.getAllReviews);
router.patch('/:id/status', authenticate, authorize('admin', 'manager'), ReviewController.updateStatus);

export default router;
