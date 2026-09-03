import { Review, IReviewDocument } from '../models/Review.model.js';
import { Product } from '../models/Product.model.js';
import { FALLBACK_ID_TO_SLUG } from './product.service.js';
import { AppError } from '../utils/response.js';
import { IReview } from '@smashd/types';
import { CreateReviewInput } from '@smashd/validation';

export class ReviewService {
  static async getProductReviews(productId: string): Promise<IReview[]> {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(productId);
    let targetProductId = productId;
    if (!isMongoId) {
      const slug = FALLBACK_ID_TO_SLUG[productId] || productId.toLowerCase();
      const p = await Product.findOne({ slug });
      if (p) targetProductId = p._id.toString();
    }

    const reviews = await Review.find({ product: targetProductId, isApproved: true })
      .populate('user', 'name avatarUrl')
      .sort({ createdAt: -1 });

    return reviews.map((r) => r.toJSON() as IReview);
  }

  static async createReview(userId: string, input: CreateReviewInput): Promise<IReview> {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(input.productId);
    let product = null;

    if (isMongoId) {
      product = await Product.findById(input.productId);
    } else {
      const slug = FALLBACK_ID_TO_SLUG[input.productId] || input.productId.toLowerCase();
      product = await Product.findOne({ slug });
    }

    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    const review = await Review.create({
      user: userId,
      product: product._id,
      rating: input.rating,
      comment: input.comment,
      isApproved: true,
    });

    // Recalculate average rating on product
    const allReviews = await Review.find({ product: input.productId, isApproved: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    product.ratingAverage = parseFloat(avgRating.toFixed(1));
    product.ratingCount = allReviews.length;
    await product.save();

    const populated = await Review.findById(review._id).populate('user', 'name avatarUrl');
    return populated!.toJSON() as IReview;
  }

  static async getAllReviews(isApproved?: boolean): Promise<IReview[]> {
    const query: any = {};
    if (isApproved !== undefined) query.isApproved = isApproved;

    const reviews = await Review.find(query)
      .populate('user', 'name email avatarUrl')
      .populate('product', 'name slug images')
      .sort({ createdAt: -1 });

    return reviews.map((r) => r.toJSON() as IReview);
  }

  static async updateStatus(id: string, isApproved: boolean): Promise<IReview> {
    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    );
    if (!review) {
      throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
    }
    return review.toJSON() as IReview;
  }
}
