import mongoose, { Document, Schema, Types } from 'mongoose';
import { IReview } from '@smashd/types';

export interface IReviewDocument extends Omit<IReview, '_id' | 'id' | 'user' | 'product'>, Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: true, index: true },
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

export const Review = mongoose.model<IReviewDocument>('Review', ReviewSchema);
