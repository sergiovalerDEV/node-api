import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendSuccess, sendPaginated } from '../adapters/http/sendResponse';
import { ValidationError } from '../errors/ValidationError';
import * as lugarService from '../services/lugar.service';
import type { LugarAttributes } from '../models/lugar.model';

export const getLugaresByCiudad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array().map(e => String(e.msg)).join(', '));
    }
    const ciudadId = Number.parseInt(String(req.params.ciudad_id), 10);
    if (Number.isNaN(ciudadId) || ciudadId < 1) throw new ValidationError('ciudad_id debe ser un entero positivo');
    const page = Math.max(1, Number.parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Number.parseInt(req.query.limit as string, 10) || 10);
    const { data, total } = await lugarService.getLugaresByCiudad(ciudadId, page, limit);
    sendPaginated(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
};

export const getLugarById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array().map(e => String(e.msg)).join(', '));
    }
    const id = Number.parseInt(String(req.params.id), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('El id debe ser un entero positivo');
    const lugar = await lugarService.getLugarById(id);
    sendSuccess(res, lugar);
  } catch (err) {
    next(err);
  }
};

export const createLugar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array().map(e => String(e.msg)).join(', '));
    }
    const lugar = await lugarService.createLugar(req.body as Omit<LugarAttributes, 'id'>);
    sendSuccess(res, lugar, 201);
  } catch (err) {
    next(err);
  }
};

export const updateLugar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array().map(e => String(e.msg)).join(', '));
    }
    const id = Number.parseInt(String(req.params.id), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('El id debe ser un entero positivo');
    const lugar = await lugarService.updateLugar(id, req.body as Partial<Omit<LugarAttributes, 'id'>>);
    sendSuccess(res, lugar);
  } catch (err) {
    next(err);
  }
};

export const deleteLugar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array().map(e => String(e.msg)).join(', '));
    }
    const id = Number.parseInt(String(req.params.id), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('El id debe ser un entero positivo');
    await lugarService.deleteLugar(id);
    sendSuccess(res, { message: 'Lugar eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};
