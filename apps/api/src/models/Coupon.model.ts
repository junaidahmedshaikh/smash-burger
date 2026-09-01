import mongoose, { Document, Schema } from 'mongoose';
import { ICoupon, CouponType } from '@smashd/types';

export interface ICouponDocument extends Omit<ICoupon, '_id' | 'id'>, Document {}

const CouponSchema = new Schema<ICouponDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    minimumOrderValue: { type: Number, default: 0 },
    maximumDiscount: { type: Number },
    expiresAt: { type: Date, required: true, index: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        if (ret._id) {
          ret.id = ret._id.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Coupon = mongoose.model<ICouponDocument>('Coupon', CouponSchema);
