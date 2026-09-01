import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createCategorySchema, updateCategorySchema } from '@smashd/validation';

const router = Router();

router.get('/', CategoryController.getAll);
router.get('/:slug', CategoryController.getBySlug);
router.post('/', authenticate, authorize('admin', 'manager'), validateBody(createCategorySchema), CategoryController.create);
router.put('/:id', authenticate, authorize('admin', 'manager'), validateBody(updateCategorySchema), CategoryController.update);
router.delete('/:id', authenticate, authorize('admin'), CategoryController.delete);

export default router;
