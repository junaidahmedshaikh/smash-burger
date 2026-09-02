import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { config } from '../config/index.js';
import { IUser } from '@smashd/types';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (user: { _id?: any; email?: string; role?: string } | any): string => {
  return jwt.sign(
    {
      userId: user._id?.toString() || '',
      email: user.email || '',
      role: user.role || 'customer',
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
  );
};

export const generateRefreshToken = (user: { _id?: any; email?: string; role?: string } | any): string => {
  return jwt.sign(
    {
      userId: user._id?.toString() || '',
      email: user.email || '',
      role: user.role || 'customer',
    },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'] }
  );
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'none' : 'lax',
    path: '/',
  });
};
