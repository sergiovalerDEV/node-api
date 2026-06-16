import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as lugarService from '../services/lugar.service';
import * as sendResponse from '../adapters/http/sendResponse';
import { getLugaresByCiudad, getLugarById, createLugar, updateLugar, deleteLugar } from './lugar.controller';
import { ValidationError } from '../errors/ValidationError';

jest.mock('express-validator', () => ({ validationResult: jest.fn() }));
jest.mock('../adapters/http/sendResponse', () => ({ sendSuccess: jest.fn(), sendPaginated: jest.fn() }));
jest.mock('../services/lugar.service');

describe('lugar controller', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next: NextFunction = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('getLugaresByCiudad uses default pagination with ciudad_id', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(lugarService.getLugaresByCiudad).mockResolvedValue({ data: [], total: 0 } as any);
        await getLugaresByCiudad({ params: { ciudad_id: '1' }, query: {} } as unknown as Request, res, next);
        expect(lugarService.getLugaresByCiudad).toHaveBeenCalledWith(1, 1, 10);
    });

    it('getLugaresByCiudad converts negative page to minimum', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(lugarService.getLugaresByCiudad).mockResolvedValue({ data: [], total: 0 } as any);
        await getLugaresByCiudad({ params: { ciudad_id: '1' }, query: { page: '-1', limit: '10' } } as unknown as Request, res, next);
        expect(lugarService.getLugaresByCiudad).toHaveBeenCalledWith(1, 1, 10);
    });

    it('getLugaresByCiudad calls sendPaginated with returned data', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(lugarService.getLugaresByCiudad).mockResolvedValue({ data: [{ id: 1 }], total: 1 } as any);
        await getLugaresByCiudad({ params: { ciudad_id: '1' }, query: { page: '1', limit: '10' } } as unknown as Request, res, next);
        expect(sendResponse.sendPaginated).toHaveBeenCalledWith(res, [{ id: 1 }], 1, 1, 10);
    });

    it('getLugaresByCiudad forwards validation error when params invalid', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'invalid' }] } as any);
        await getLugaresByCiudad({ params: { ciudad_id: '0' }, query: {} } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('getLugaresByCiudad forwards validation error for invalid ciudad_id', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        await getLugaresByCiudad({ params: { ciudad_id: '0' }, query: {} } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('getLugaresByCiudad forwards service errors to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(lugarService.getLugaresByCiudad).mockRejectedValue(new Error('db error'));
        await getLugaresByCiudad({ params: { ciudad_id: '1' }, query: {} } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('getLugarById calls sendSuccess with lugar data', async () => {
        const lugar = { id: 1, name: 'Prado' } as any;
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(lugarService.getLugarById).mockResolvedValue(lugar);
        await getLugarById({ params: { id: '1' } } as unknown as Request, res, next);
        expect(sendResponse.sendSuccess).toHaveBeenCalledWith(res, lugar);
    });

    it('getLugarById forwards validation error when validation fails', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'invalid' }] } as any);
        await getLugarById({ params: { id: '1' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('getLugarById forwards validation error for invalid id', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        await getLugarById({ params: { id: '0' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('getLugarById forwards service errors to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(lugarService.getLugarById).mockRejectedValue(new Error('db error'));
        await getLugarById({ params: { id: '1' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('createLugar returns created lugar with status 201', async () => {
        const data = { name: 'Parque', ciudad_id: 1 } as any;
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(lugarService.createLugar).mockResolvedValue(data);
        await createLugar({ body: data } as unknown as Request, res, next);
        expect(sendResponse.sendSuccess).toHaveBeenCalledWith(res, data, 201);
    });

    it('createLugar forwards validation failure to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'invalid' }] } as any);
        await createLugar({ body: {} } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('createLugar forwards service errors to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(lugarService.createLugar).mockRejectedValue(new Error('db error'));
        await createLugar({ body: { name: 'Parque' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('updateLugar returns updated lugar', async () => {
        const updated = { id: 2, name: 'Parque' } as any;
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(lugarService.updateLugar).mockResolvedValue(updated);
        await updateLugar({ params: { id: '2' }, body: { name: 'Parque' } } as unknown as Request, res, next);
        expect(sendResponse.sendSuccess).toHaveBeenCalledWith(res, updated);
    });

    it('updateLugar forwards validation failure to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'invalid' }] } as any);
        await updateLugar({ params: { id: '1' }, body: {} } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('updateLugar forwards validation error for invalid id', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        await updateLugar({ params: { id: '0' }, body: {} } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('updateLugar forwards service errors to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(lugarService.updateLugar).mockRejectedValue(new Error('db error'));
        await updateLugar({ params: { id: '1' }, body: { name: 'X' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('deleteLugar returns success message after deletion', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(lugarService.deleteLugar).mockResolvedValue(null as any);
        await deleteLugar({ params: { id: '3' } } as unknown as Request, res, next);
        expect(sendResponse.sendSuccess).toHaveBeenCalledWith(res, { message: 'Lugar eliminado correctamente' });
    });

    it('deleteLugar forwards validation failure to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'invalid' }] } as any);
        await deleteLugar({ params: { id: '3' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('deleteLugar forwards validation error for invalid id', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        await deleteLugar({ params: { id: '0' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('deleteLugar forwards service errors to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(lugarService.deleteLugar).mockRejectedValue(new Error('db error'));
        await deleteLugar({ params: { id: '1' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});