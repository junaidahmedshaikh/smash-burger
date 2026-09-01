import { Category, ICategoryDocument } from '../models/Category.model.js';
import { Product } from '../models/Product.model.js';
import { AppError } from '../utils/response.js';
import { ICategory } from '@smashd/types';
import { CreateCategoryInput } from '@smashd/validation';

export class CategoryService {
  static async getAll(includeInactive: boolean = false): Promise<ICategory[]> {
    const filter = includeInactive ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ sortOrder: 1, createdAt: 1 });

    // Calculate product counts dynamically for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id, isAvailable: true });
        const json = cat.toJSON() as ICategory;
        json.productCount = count;
        return json;
      })
    );

    return categoriesWithCount;
  }

  static async getBySlug(slug: string): Promise<ICategory> {
    const category = await Category.findOne({ slug: slug.toLowerCase() });
    if (!category) {
      throw new AppError(`Category '${slug}' not found`, 404, 'CATEGORY_NOT_FOUND');
    }
    const count = await Product.countDocuments({ category: category._id, isAvailable: true });
    const json = category.toJSON() as ICategory;
    json.productCount = count;
    return json;
  }

  static async create(input: CreateCategoryInput): Promise<ICategory> {
    const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await Category.findOne({ slug });
    if (existing) {
      throw new AppError(`Category with slug '${slug}' already exists`, 409, 'CATEGORY_EXISTS');
    }

    const category = await Category.create({
      ...input,
      slug,
    });

    return category.toJSON() as ICategory;
  }

  static async update(id: string, input: Partial<CreateCategoryInput>): Promise<ICategory> {
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true }
    );
    if (!category) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    }
    return category.toJSON() as ICategory;
  }

  static async delete(id: string): Promise<void> {
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      throw new AppError(
        `Cannot delete category with ${productCount} assigned products. Reassign or delete products first.`,
        400,
        'CATEGORY_HAS_PRODUCTS'
      );
    }
    const result = await Category.findByIdAndDelete(id);
    if (!result) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    }
  }
}
