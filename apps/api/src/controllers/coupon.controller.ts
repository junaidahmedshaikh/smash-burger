import { Request, Response, NextFunction } from 'express';
import { CouponService } from '../services/coupon.service.js';
import { sendSuccess } from '../utils/response.js';

export class CouponController {
  static async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, orderSubtotal } = req.body;
      const result = await CouponService.validate(code, orderSubtotal);
      sendSuccess(res, result, result.message || 'Coupon validated');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupons = await CouponService.getAll();
      sendSuccess(res, coupons, 'Coupons fetched');
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupon = await CouponService.create(req.body);
      sendSuccess(res, coupon, 'Coupon created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupon = await CouponService.update(req.params.id as string, req.body);
      sendSuccess(res, coupon, 'Coupon updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await CouponService.delete(req.params.id as string);
      sendSuccess(res, null, 'Coupon deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
