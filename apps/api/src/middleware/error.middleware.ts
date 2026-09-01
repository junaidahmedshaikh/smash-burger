import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '../utils/response.js';
import { config } from '../config/index.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error occurred';
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let details = err.details;

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An entry with this ${field} already exists`;
    code = 'DUPLICATE_ENTRY';
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource ID: ${err.value}`;
    code = 'INVALID_RESOURCE_ID';
  }

  // Log in development or for 500s
  if (statusCode === 500 || config.env === 'development') {
    console.error('💥 Error Caught in Middleware:', {
      path: req.path,
      method: req.method,
      statusCode,
      message,
      stack: config.env === 'development' ? err.stack : undefined,
    });
  }

  sendError(res, message, statusCode, code, details);
};
