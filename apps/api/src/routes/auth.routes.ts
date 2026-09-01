import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  addressSchema,
} from '@smashd/validation';

const router = Router();

router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, validateBody(updateProfileSchema), AuthController.updateProfile);
router.post('/addresses', authenticate, validateBody(addressSchema), AuthController.addAddress);
router.delete('/addresses/:addressId', authenticate, AuthController.deleteAddress);

export default router;
