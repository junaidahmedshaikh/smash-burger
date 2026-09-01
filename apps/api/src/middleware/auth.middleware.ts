import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt.js';
import { AppError } from '../utils/response.js';
import { User } from '../models/User.model.js';
import { UserRole } from '@smashd/types';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { _id: string; role: UserRole };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AppError('Authentication required. Please login.', 401, 'UNAUTHORIZED');
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId).select('role email name');

    if (!user) {
      throw new AppError('User not found or session has expired', 401, 'USER_NOT_FOUND');
    }

    req.user = {
      userId: user._id.toString(),
      _id: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      next(new AppError('Token has expired. Please refresh session.', 401, 'TOKEN_EXPIRED'));
    } else if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token signature.', 401, 'INVALID_TOKEN'));
    } else {
      next(error);
    }
  }
};

export const optionalAuthenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const payload = verifyAccessToken(token);
      const user = await User.findById(payload.userId).select('role email name');
      if (user) {
        req.user = {
          userId: user._id.toString(),
          _id: user._id.toString(),
          email: user.email,
          role: user.role as UserRole,
        };
      }
    }
    next();
  } catch (error) {
    // If token invalid, simply proceed as guest
    next();
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403, 'FORBIDDEN')
      );
    }

    next();
  };
};
