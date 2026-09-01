import { Response } from 'express';
import { ApiResponse, ApiErrorResponse } from '@smashd/types';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
  meta?: any
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code: string = 'ERROR',
  details?: any
): Response => {
  const payload: ApiErrorResponse = {
    success: false,
    message,
    error: {
      code,
      details,
    },
  };
  return res.status(statusCode).json(payload);
};
