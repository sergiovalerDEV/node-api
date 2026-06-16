import { Response } from 'express';

export const sendSuccess = (res: Response, data: unknown, status = 200): void => {
  res.status(status).json({ success: true, data });
};

export const sendError = (res: Response, message: string, status = 500): void => {
  res.status(status).json({ success: false, error: message });
};

export const sendPaginated = (
  res: Response,
  data: unknown[],
  total: number,
  page: number,
  limit: number
): void => {
  res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
};
