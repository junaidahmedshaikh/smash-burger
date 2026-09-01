import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service.js';
import { sendSuccess } from '../utils/response.js';

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        category,
        isVegetarian,
        spiceLevel,
        isFeatured,
        isAvailable,
        search,
        sortBy,
        page,
        limit,
      } = req.query;

      const result = await ProductService.getAll({
        category: category as string,
        isVegetarian: isVegetarian !== undefined ? isVegetarian === 'true' : undefined,
        spiceLevel: spiceLevel !== undefined ? parseInt(spiceLevel as string, 10) : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
        isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined,
        search: search as string,
        sortBy: sortBy as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50,
      });

      sendSuccess(res, result.products, 'Products fetched successfully', 200, {
        total: result.total,
        totalPages: result.totalPages,
        page: result.page,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await ProductService.getFeatured();
      sendSuccess(res, products, 'Featured products fetched');
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await ProductService.getBySlug(req.params.slug as string);
      sendSuccess(res, product, 'Product fetched');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await ProductService.getById(req.params.id as string);
      sendSuccess(res, product, 'Product fetched');
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await ProductService.create(req.body);
      sendSuccess(res, product, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await ProductService.update(req.params.id as string, req.body);
      sendSuccess(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ProductService.delete(req.params.id as string);
      sendSuccess(res, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
