import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createProductSchema, updateProductSchema } from '@smashd/validation';

const router = Router();

router.get('/', ProductController.getAll);
router.get('/featured', ProductController.getFeatured);
router.get('/slug/:slug', ProductController.getBySlug);
router.get('/:id', ProductController.getById);

router.post('/', authenticate, authorize('admin', 'manager'), validateBody(createProductSchema), ProductController.create);
router.put('/:id', authenticate, authorize('admin', 'manager'), validateBody(updateProductSchema), ProductController.update);
router.delete('/:id', authenticate, authorize('admin'), ProductController.delete);

export default router;
