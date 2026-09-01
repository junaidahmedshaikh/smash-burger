import bcrypt from 'bcryptjs';
import { User, IUserDocument } from '../models/User.model.js';
import { AppError } from '../utils/response.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { IAuthResponse, IUser, IUserAddress } from '@smashd/types';
import { RegisterInput, LoginInput } from '@smashd/validation';

export class AuthService {
  static async register(input: RegisterInput): Promise<IAuthResponse & { refreshToken: string }> {
    const existing = await User.findOne({ email: input.email });
    if (existing) {
      throw new AppError('An account with this email address already exists', 409, 'EMAIL_EXISTS');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    // Check if this is the first user ever; if so, assign admin role for easy dev/setup
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'customer';

    const user = await User.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role,
      isEmailVerified: true,
      addresses: [],
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: user.toJSON() as IUser,
      accessToken,
      refreshToken,
    };
  }

  static async login(input: LoginInput): Promise<IAuthResponse & { refreshToken: string }> {
    const user = await User.findOne({ email: input.email }).select('+passwordHash +refreshToken');
    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: user.toJSON() as IUser,
      accessToken,
      refreshToken,
    };
  }

  static async refresh(refreshToken: string): Promise<{ accessToken: string; user: IUser }> {
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 401, 'REFRESH_TOKEN_REQUIRED');
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Invalid or expired refresh token. Please log in again.', 401, 'INVALID_REFRESH_TOKEN');
    }

    const accessToken = generateAccessToken(user);
    return {
      accessToken,
      user: user.toJSON() as IUser,
    };
  }

  static async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  }

  static async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    return user.toJSON() as IUser;
  }

  static async updateProfile(userId: string, data: { name?: string; phone?: string; avatarUrl?: string }): Promise<IUser> {
    const user = await User.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true });
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    return user.toJSON() as IUser;
  }

  static async addAddress(userId: string, addressData: IUserAddress): Promise<IUserAddress[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (addressData.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    } else if (user.addresses.length === 0) {
      addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();
    return user.addresses;
  }

  static async deleteAddress(userId: string, addressId: string): Promise<IUserAddress[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    user.addresses = user.addresses.filter((addr: any) => addr._id.toString() !== addressId);
    await user.save();
    return user.addresses;
  }
}
