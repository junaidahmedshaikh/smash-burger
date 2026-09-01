import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticate, optionalAuthenticate, authorize } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  orderQuoteRequestSchema,
  createOrderSchema,
  updateOrderStatusSchema,
} from '@smashd/validation';

const router = Router();

router.post('/quote', validateBody(orderQuoteRequestSchema), OrderController.calculateQuote);
router.post('/', optionalAuthenticate, validateBody(createOrderSchema), OrderController.createOrder);
router.get('/my-orders', authenticate, OrderController.getMyOrders);
router.get('/:id', OrderController.getById);

// Admin routes
router.get('/', authenticate, authorize('admin', 'manager'), OrderController.getAllOrders);
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin', 'manager'),
  validateBody(updateOrderStatusSchema),
  OrderController.updateStatus
);

export default router;
