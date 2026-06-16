import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendSuccess, sendPaginated } from '../../adapters/http/sendResponse';
import { ValidationError } from '../../errors/ValidationError/ValidationError';
import * as ciudadService from '../../services/ciudad/ciudad.service';
import type { CiudadAttributes } from '../../models/ciudad/ciudad.model';

export const getAllCiudades = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Number.parseInt(req.query.limit as string, 10) || 10);
    const { data, total } = await ciudadService.getAllCiudades(page, limit);
    sendPaginated(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
};

export const getCiudadById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array().map(e => String(e.msg)).join(', '));
    }
    const id = Number.parseInt(String(req.params.id), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('El id debe ser un entero positivo');
    const ciudad = await ciudadService.getCiudadById(id);
    sendSuccess(res, ciudad);
  } catch (err) {
    next(err);
  }
};

export const createCiudad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array().map(e => String(e.msg)).join(', '));
    }
    const ciudad = await ciudadService.createCiudad(req.body as Omit<CiudadAttributes, 'id'>);
    sendSuccess(res, ciudad, 201);
  } catch (err) {
    next(err);
  }
};

export const updateCiudad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array().map(e => String(e.msg)).join(', '));
    }
    const id = Number.parseInt(String(req.params.id), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('El id debe ser un entero positivo');
    const ciudad = await ciudadService.updateCiudad(id, req.body as Omit<CiudadAttributes, 'id'>);
    sendSuccess(res, ciudad);
  } catch (err) {
    next(err);
  }
};

export const deleteCiudad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array().map(e => String(e.msg)).join(', '));
    }
    const id = Number.parseInt(String(req.params.id), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('El id debe ser un entero positivo');
    await ciudadService.deleteCiudad(id);
    sendSuccess(res, { message: 'Ciudad eliminada correctamente' });
  } catch (err) {
    next(err);
  }
};
