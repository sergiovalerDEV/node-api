import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { errorMiddleware } from './errorMiddleware';
import { AppError } from '../errors/AppError';
import { sendError } from '../adapters/http/sendResponse';

jest.mock('../adapters/http/sendResponse', () => ({
  sendError: jest.fn(),
}));

describe('errorMiddleware', () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls sendError with app error status', () => {
    errorMiddleware(new AppError(418, 'teapot'), {} as any, res, next);
    expect(sendError).toHaveBeenCalledWith(res, 'teapot', 418);
  });

  it('calls sendError with generic server error for unknown errors', () => {
    errorMiddleware(new Error('boom'), {} as any, res, next);
    expect(sendError).toHaveBeenCalledWith(res, 'Error interno del servidor', 500);
  });
});
