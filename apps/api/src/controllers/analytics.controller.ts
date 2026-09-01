import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { sendSuccess } from '../utils/response.js';

export class AnalyticsController {
  static async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AnalyticsService.getDashboardStats();
      sendSuccess(res, stats, 'Dashboard analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
