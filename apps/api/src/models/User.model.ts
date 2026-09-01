import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IUserAddress, UserRole } from '@smashd/types';

export interface IUserDocument extends Omit<IUser, '_id' | 'id'>, Document {
  passwordHash?: string;
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IUserAddress>({
  label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  street: { type: String, required: true },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['customer', 'manager', 'admin'],
      default: 'customer',
      index: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    avatarUrl: { type: String },
    addresses: [AddressSchema],
    refreshToken: { type: String, select: false },
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
        delete ret.passwordHash;
        delete ret.refreshToken;
        return ret;
      },
    },
  }
);

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);
