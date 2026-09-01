import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { validateCouponSchema, createCouponSchema } from '@smashd/validation';

const router = Router();

router.post('/validate', validateBody(validateCouponSchema), CouponController.validate);
router.get('/', authenticate, authorize('admin', 'manager'), CouponController.getAll);
router.post('/', authenticate, authorize('admin', 'manager'), validateBody(createCouponSchema), CouponController.create);
router.put('/:id', authenticate, authorize('admin', 'manager'), CouponController.update);
router.delete('/:id', authenticate, authorize('admin'), CouponController.delete);

export default router;
