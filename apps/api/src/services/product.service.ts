import { Product, IProductDocument } from '../models/Product.model.js';
import { Category } from '../models/Category.model.js';
import { AppError } from '../utils/response.js';
import { IProduct } from '@smashd/types';
import { CreateProductInput } from '@smashd/validation';

export interface ProductQueryParams {
  category?: string; // slug or ID
  isVegetarian?: boolean;
  spiceLevel?: number;
  isFeatured?: boolean;
  isAvailable?: boolean;
  search?: string;
  sortBy?: 'sortOrder' | 'priceAsc' | 'priceDesc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export class ProductService {
  static async getAll(params: ProductQueryParams): Promise<{ products: IProduct[]; total: number; totalPages: number; page: number }> {
    const {
      category,
      isVegetarian,
      spiceLevel,
      isFeatured,
      isAvailable = true,
      search,
      sortBy = 'sortOrder',
      page = 1,
      limit = 50,
    } = params;

    const query: any = {};

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable;
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured;
    }

    if (isVegetarian !== undefined) {
      query.isVegetarian = isVegetarian;
    }

    if (spiceLevel !== undefined) {
      query.spiceLevel = spiceLevel;
    }

    if (category) {
      // Check if it's an ObjectId or slug
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category.toLowerCase() });
        if (cat) {
          query.category = cat._id;
        }
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } },
      ];
    }

    let sort: any = { sortOrder: 1, createdAt: -1 };
    if (sortBy === 'priceAsc') sort = { price: 1 };
    else if (sortBy === 'priceDesc') sort = { price: -1 };
    else if (sortBy === 'rating') sort = { ratingAverage: -1 };
    else if (sortBy === 'newest') sort = { createdAt: -1 };

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const products = await Product.find(query)
      .populate('category', 'name slug image')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return {
      products: products.map((p) => p.toJSON() as IProduct),
      total,
      totalPages,
      page,
    };
  }

  static async getFeatured(): Promise<IProduct[]> {
    const products = await Product.find({ isFeatured: true, isAvailable: true })
      .populate('category', 'name slug image')
      .sort({ sortOrder: 1 });
    return products.map((p) => p.toJSON() as IProduct);
  }

  static async getBySlug(slug: string): Promise<IProduct> {
    const product = await Product.findOne({ slug: slug.toLowerCase() }).populate('category', 'name slug image');
    if (!product) {
      throw new AppError(`Product '${slug}' not found`, 404, 'PRODUCT_NOT_FOUND');
    }
    return product.toJSON() as IProduct;
  }

  static async getById(id: string): Promise<IProduct> {
    const product = await Product.findById(id).populate('category', 'name slug image');
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }
    return product.toJSON() as IProduct;
  }

  static async create(input: CreateProductInput): Promise<IProduct> {
    const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await Product.findOne({ slug });
    if (existing) {
      throw new AppError(`Product with slug '${slug}' already exists`, 409, 'PRODUCT_EXISTS');
    }

    const categoryExists = await Category.findById(input.category);
    if (!categoryExists) {
      throw new AppError('Specified category does not exist', 400, 'CATEGORY_NOT_FOUND');
    }

    const product = await Product.create({
      ...input,
      slug,
    });

    const populated = await Product.findById(product._id).populate('category', 'name slug image');
    return populated!.toJSON() as IProduct;
  }

  static async update(id: string, input: Partial<CreateProductInput>): Promise<IProduct> {
    if (input.category) {
      const categoryExists = await Category.findById(input.category);
      if (!categoryExists) {
        throw new AppError('Specified category does not exist', 400, 'CATEGORY_NOT_FOUND');
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true }
    ).populate('category', 'name slug image');

    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    return product.toJSON() as IProduct;
  }

  static async delete(id: string): Promise<void> {
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }
  }
}
