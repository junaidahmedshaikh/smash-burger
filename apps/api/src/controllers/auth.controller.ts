import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/jwt.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      setRefreshTokenCookie(res, result.refreshToken);
      sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      setRefreshTokenCookie(res, result.refreshToken);
      sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 'Login successful', 200);
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      const result = await AuthService.refresh(refreshToken);
      sendSuccess(res, result, 'Token refreshed', 200);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user?.userId) {
        await AuthService.logout(req.user.userId);
      }
      clearRefreshTokenCookie(res);
      sendSuccess(res, null, 'Logged out successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AuthService.getProfile(req.user!.userId);
      sendSuccess(res, user, 'Profile retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AuthService.updateProfile(req.user!.userId, req.body);
      sendSuccess(res, user, 'Profile updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async addAddress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const addresses = await AuthService.addAddress(req.user!.userId, req.body);
      sendSuccess(res, addresses, 'Address added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async deleteAddress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const addressId = req.params.addressId as string;
      const addresses = await AuthService.deleteAddress(req.user!.userId, addressId);
      sendSuccess(res, addresses, 'Address removed successfully', 200);
    } catch (error) {
      next(error);
    }
  }
}
