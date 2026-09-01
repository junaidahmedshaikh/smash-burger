import { Coupon, ICouponDocument } from '../models/Coupon.model.js';
import { AppError } from '../utils/response.js';
import { ICoupon, IValidateCouponResponse } from '@smashd/types';
import { CreateCouponInput } from '@smashd/validation';

export class CouponService {
  static async validate(code: string, orderSubtotal: number): Promise<IValidateCouponResponse> {
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) {
      return {
        isValid: false,
        discountAmount: 0,
        coupon: null as any,
        message: 'Invalid promo code. Please check and try again.',
      };
    }

    if (!coupon.isActive) {
      return {
        isValid: false,
        discountAmount: 0,
        coupon: coupon.toJSON() as ICoupon,
        message: 'This promo code is currently inactive.',
      };
    }

    if (new Date() > new Date(coupon.expiresAt)) {
      return {
        isValid: false,
        discountAmount: 0,
        coupon: coupon.toJSON() as ICoupon,
        message: 'This promo code has expired.',
      };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return {
        isValid: false,
        discountAmount: 0,
        coupon: coupon.toJSON() as ICoupon,
        message: 'This promo code has reached its maximum usage limit.',
      };
    }

    if (orderSubtotal < coupon.minimumOrderValue) {
      return {
        isValid: false,
        discountAmount: 0,
        coupon: coupon.toJSON() as ICoupon,
        message: `Order subtotal must be at least ₹${coupon.minimumOrderValue} to apply this code.`,
      };
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((orderSubtotal * coupon.value) / 100);
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.value, orderSubtotal);
    }

    return {
      isValid: true,
      discountAmount,
      coupon: coupon.toJSON() as ICoupon,
      message: `Promo code applied successfully! You saved ₹${discountAmount}.`,
    };
  }

  static async getAll(): Promise<ICoupon[]> {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return coupons.map((c) => c.toJSON() as ICoupon);
  }

  static async create(input: CreateCouponInput): Promise<ICoupon> {
    const existing = await Coupon.findOne({ code: input.code.toUpperCase().trim() });
    if (existing) {
      throw new AppError(`Coupon with code '${input.code}' already exists`, 409, 'COUPON_EXISTS');
    }

    const coupon = await Coupon.create({
      ...input,
      code: input.code.toUpperCase().trim(),
      expiresAt: new Date(input.expiresAt),
    });

    return coupon.toJSON() as ICoupon;
  }

  static async update(id: string, input: Partial<CreateCouponInput>): Promise<ICoupon> {
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true }
    );
    if (!coupon) {
      throw new AppError('Coupon not found', 404, 'COUPON_NOT_FOUND');
    }
    return coupon.toJSON() as ICoupon;
  }

  static async delete(id: string): Promise<void> {
    const result = await Coupon.findByIdAndDelete(id);
    if (!result) {
      throw new AppError('Coupon not found', 404, 'COUPON_NOT_FOUND');
    }
  }

  static async incrementUsage(code: string): Promise<void> {
    await Coupon.findOneAndUpdate(
      { code: code.toUpperCase().trim() },
      { $inc: { usedCount: 1 } }
    );
  }
}
