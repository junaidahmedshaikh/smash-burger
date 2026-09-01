import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class OrderController {
  static async calculateQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quote = await OrderService.calculateQuote(req.body);
      sendSuccess(res, quote, 'Order quote calculated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const order = await OrderService.createOrder(req.body, userId);
      sendSuccess(res, order, 'Order created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await OrderService.getById(req.params.id as string);
      sendSuccess(res, order, 'Order fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMyOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await OrderService.getUserOrders(req.user!.userId);
      sendSuccess(res, orders, 'User orders retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, page, limit } = req.query;
      const result = await OrderService.getAllOrders({
        status: status as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });

      sendSuccess(res, result.orders, 'All orders retrieved', 200, {
        total: result.total,
        totalPages: result.totalPages,
        page: result.page,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, note } = req.body;
      const order = await OrderService.updateStatus(req.params.id as string, status, note);
      sendSuccess(res, order, 'Order status updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
