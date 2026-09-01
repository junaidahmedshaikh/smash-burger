import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smashd_burger',
  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret_smashd_access_jwt_key_2026_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || 'super_secret_smashd_refresh_jwt_key_2026_production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_key_secret',
  },
  store: {
    name: 'Smash Burger',
    taxPercentage: parseFloat(process.env.TAX_PERCENTAGE || '5'), // 5% GST
    deliveryFee: parseFloat(process.env.DELIVERY_FEE || '49'),
    freeDeliveryThreshold: parseFloat(process.env.FREE_DELIVERY_THRESHOLD || '499'),
  },
};
