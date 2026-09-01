import mongoose from 'mongoose';
import { config } from './index.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB successfully at:', config.mongoUri.replace(/\/\/.*@/, '//***@'));
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    // In dev mode, don't immediately crash if Mongo is not running yet; log clear instructions
    if (config.env === 'development') {
      console.warn('⚠️ Warning: Ensure MongoDB is running locally (e.g. `mongod` or Docker container).');
    } else {
      process.exit(1);
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};
