import mongoose, { Document, Schema, Types } from 'mongoose';
import { IProduct, ICustomizationOption, ICustomizationChoice, INutritionalInfo } from '@smashd/types';

export interface IProductDocument extends Omit<IProduct, '_id' | 'id' | 'category'>, Document {
  category: Types.ObjectId;
}

const CustomizationChoiceSchema = new Schema<ICustomizationChoice>({
  name: { type: String, required: true },
  priceDelta: { type: Number, required: true, default: 0 },
  isDefault: { type: Boolean, default: false },
  caloriesDelta: { type: Number, default: 0 },
});

const CustomizationOptionSchema = new Schema<ICustomizationOption>({
  groupName: { type: String, required: true },
  minSelect: { type: Number, required: true, default: 0 },
  maxSelect: { type: Number, required: true, default: 1 },
  choices: [CustomizationChoiceSchema],
});

const NutritionalInfoSchema = new Schema<INutritionalInfo>({
  calories: { type: Number, default: 0 },
  proteinGrams: { type: Number, default: 0 },
  carbsGrams: { type: Number, default: 0 },
  fatGrams: { type: Number, default: 0 },
});

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number },
    images: [{ type: String, required: true }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    ingredients: [{ type: String, required: true }],
    nutritionalInformation: { type: NutritionalInfoSchema, required: true },
    customizationOptions: [CustomizationOptionSchema],
    spiceLevel: { type: Number, enum: [0, 1, 2, 3], default: 0 },
    preparationTimeMinutes: { type: Number, default: 15 },
    isFeatured: { type: Boolean, default: false, index: true },
    isAvailable: { type: Boolean, default: true, index: true },
    isVegetarian: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 4.8 },
    ratingCount: { type: Number, default: 0 },
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

ProductSchema.index({ name: 'text', description: 'text', ingredients: 'text' });

export const Product = mongoose.model<IProductDocument>('Product', ProductSchema);
