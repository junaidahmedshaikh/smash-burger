import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', SettingsController.getSettings);
router.put('/', authenticate, authorize('admin'), SettingsController.updateSettings);

export default router;
