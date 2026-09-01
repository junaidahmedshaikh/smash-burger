import mongoose, { Document, Schema } from 'mongoose';
import { ICategory } from '@smashd/types';

export interface ICategoryDocument extends Omit<ICategory, '_id' | 'id'>, Document {}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    icon: { type: String },
    sortOrder: { type: Number, default: 0 },
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

export const Category = mongoose.model<ICategoryDocument>('Category', CategorySchema);
