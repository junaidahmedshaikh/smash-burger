import mongoose, { Document, Schema } from 'mongoose';
import { IStoreSettings, IStoreLocation } from '@smashd/types';

export interface IStoreSettingsDocument extends IStoreSettings, Document {}

const StoreLocationSchema = new Schema<IStoreLocation>({
  city: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  openingHours: { type: String, default: '11:00 AM – 01:00 AM' },
  isActive: { type: Boolean, default: true },
});

const StoreSettingsSchema = new Schema<IStoreSettingsDocument>(
  {
    storeName: { type: String, default: 'Smash Burger' },
    tagline: { type: String, default: 'Unapologetic Flavor. Smashed Fresh.' },
    deliveryFee: { type: Number, default: 49 },
    freeDeliveryThreshold: { type: Number, default: 499 },
    taxPercentage: { type: Number, default: 5 }, // 5% GST
    isOpen: { type: Boolean, default: true },
    locations: [StoreLocationSchema],
  },
  {
    timestamps: true,
  }
);

export const StoreSettings = mongoose.model<IStoreSettingsDocument>(
  'StoreSettings',
  StoreSettingsSchema
);
