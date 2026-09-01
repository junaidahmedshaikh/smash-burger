import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { AppError } from './utils/response.js';

export const createApp = (): Express => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: [config.clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Rate Limiting (Relaxed for dev, strict for prod)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: config.env === 'development' ? 1000 : 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests from this IP. Please try again after 15 minutes.',
      error: { code: 'RATE_LIMIT_EXCEEDED' },
    },
  });
  app.use('/api', limiter);

  // Body & Cookie Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Request Logging
  if (config.env !== 'test') {
    app.use(morgan('dev'));
  }

  // API Routes
  app.use('/api/v1', routes);

  // Root Welcome Endpoint
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      name: "SMASH'D Craft Burger Co. API",
      version: '1.0.0',
      docs: '/api/v1/health',
    });
  });

  // 404 Handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Endpoint not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
