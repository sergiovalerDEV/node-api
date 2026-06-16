import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { sendError } from '../adapters/http/sendResponse';

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }
  console.error(err);
  sendError(res, 'Error interno del servidor', 500);
};
