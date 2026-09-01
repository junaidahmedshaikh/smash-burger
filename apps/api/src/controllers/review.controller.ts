import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class ReviewController {
  static async getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviews = await ReviewService.getProductReviews(req.params.productId as string);
      sendSuccess(res, reviews, 'Reviews fetched');
    } catch (error) {
      next(error);
    }
  }

  static async createReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const review = await ReviewService.createReview(req.user!.userId, req.body);
      sendSuccess(res, review, 'Review submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getAllReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isApproved = req.query.isApproved !== undefined ? req.query.isApproved === 'true' : undefined;
      const reviews = await ReviewService.getAllReviews(isApproved);
      sendSuccess(res, reviews, 'All reviews retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isApproved } = req.body;
      const review = await ReviewService.updateStatus(req.params.id as string, isApproved);
      sendSuccess(res, review, 'Review moderation updated');
    } catch (error) {
      next(error);
    }
  }
}
