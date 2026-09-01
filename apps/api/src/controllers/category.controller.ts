import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service.js';
import { sendSuccess } from '../utils/response.js';

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const categories = await CategoryService.getAll(includeInactive);
      sendSuccess(res, categories, 'Categories fetched');
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await CategoryService.getBySlug(req.params.slug as string);
      sendSuccess(res, category, 'Category fetched');
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await CategoryService.create(req.body);
      sendSuccess(res, category, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await CategoryService.update(req.params.id as string, req.body);
      sendSuccess(res, category, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await CategoryService.delete(req.params.id as string);
      sendSuccess(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
