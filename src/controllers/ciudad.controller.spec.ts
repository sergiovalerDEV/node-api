import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as ciudadService from '../services/ciudad.service';
import * as sendResponse from '../adapters/http/sendResponse';
import { getAllCiudades, getCiudadById, createCiudad, updateCiudad, deleteCiudad } from './ciudad.controller';
import { ValidationError } from '../errors/ValidationError';

jest.mock('express-validator', () => ({ validationResult: jest.fn() }));
jest.mock('../adapters/http/sendResponse', () => ({ sendSuccess: jest.fn(), sendPaginated: jest.fn() }));
jest.mock('../services/ciudad.service');

describe('ciudad controller', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next: NextFunction = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('getAllCiudades uses default pagination values', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(ciudadService.getAllCiudades).mockResolvedValue({ data: [], total: 0 } as any);
        await getAllCiudades({ query: {} } as Request, res, next);
        expect(ciudadService.getAllCiudades).toHaveBeenCalledWith(1, 10);
    });

    it('getAllCiudades converts negative page to minimum', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(ciudadService.getAllCiudades).mockResolvedValue({ data: [], total: 0 } as any);
        await getAllCiudades({ query: { page: '-1', limit: '10' } } as unknown as Request, res, next);
        expect(ciudadService.getAllCiudades).toHaveBeenCalledWith(1, 10);
    });

    it('getAllCiudades calls sendPaginated with returned data', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(ciudadService.getAllCiudades).mockResolvedValue({ data: [{ id: 1 }], total: 1 } as any);
        await getAllCiudades({ query: { page: '1', limit: '10' } } as unknown as Request, res, next);
        expect(sendResponse.sendPaginated).toHaveBeenCalledWith(res, [{ id: 1 }], 1, 1, 10);
    });

    it('getAllCiudades forwards service errors to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(ciudadService.getAllCiudades).mockRejectedValue(new Error('boom'));
        await getAllCiudades({ query: {} } as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('getCiudadById calls sendSuccess with ciudad data', async () => {
        const ciudad = { id: 1, name: 'Madrid' } as any;
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(ciudadService.getCiudadById).mockResolvedValue(ciudad);
        await getCiudadById({ params: { id: '1' } } as unknown as Request, res, next);
        expect(sendResponse.sendSuccess).toHaveBeenCalledWith(res, ciudad);
    });

    it('getCiudadById sends validation error when validation fails', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'invalid' }] } as any);
        await getCiudadById({ params: { id: '1' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('getCiudadById sends validation error for invalid id', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        await getCiudadById({ params: { id: '0' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('getCiudadById forwards service errors to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(ciudadService.getCiudadById).mockRejectedValue(new Error('db error'));
        await getCiudadById({ params: { id: '1' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('createCiudad calls service and returns created ciudad', async () => {
        const body = { name: 'Sevilla' } as any;
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(ciudadService.createCiudad).mockResolvedValue(body);
        await createCiudad({ body } as Request, res, next);
        expect(sendResponse.sendSuccess).toHaveBeenCalledWith(res, body, 201);
    });

    it('createCiudad forwards validation failure to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'invalid' }] } as any);
        await createCiudad({ body: {} } as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('createCiudad forwards service errors to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(ciudadService.createCiudad).mockRejectedValue(new Error('db error'));
        await createCiudad({ body: { name: 'Sevilla' } } as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('updateCiudad calls service with id and body', async () => {
        const body = { name: 'Sevilla' };
        const updated = { id: 1, ...body } as any;
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(ciudadService.updateCiudad).mockResolvedValue(updated);
        await updateCiudad({ params: { id: '1' }, body } as unknown as Request, res, next);
        expect(sendResponse.sendSuccess).toHaveBeenCalledWith(res, updated);
    });

    it('updateCiudad forwards validation failure to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'invalid' }] } as any);
        await updateCiudad({ params: { id: '1' }, body: {} } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('updateCiudad forwards validation error for invalid id', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        await updateCiudad({ params: { id: '0' }, body: {} } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('updateCiudad forwards service errors to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(ciudadService.updateCiudad).mockRejectedValue(new Error('db error'));
        await updateCiudad({ params: { id: '1' }, body: { name: 'X' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('deleteCiudad calls service and returns success message', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(ciudadService.deleteCiudad).mockResolvedValue(null as any);
        await deleteCiudad({ params: { id: '2' } } as unknown as Request, res, next);
        expect(sendResponse.sendSuccess).toHaveBeenCalledWith(res, { message: 'Ciudad eliminada correctamente' });
    });

    it('deleteCiudad forwards validation failure to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'invalid' }] } as any);
        await deleteCiudad({ params: { id: '2' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('deleteCiudad forwards validation error for invalid id', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        await deleteCiudad({ params: { id: '0' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('deleteCiudad forwards service errors to next', async () => {
        jest.mocked(validationResult).mockReturnValue({ isEmpty: () => true } as any);
        jest.mocked(ciudadService.deleteCiudad).mockRejectedValue(new Error('db error'));
        await deleteCiudad({ params: { id: '1' } } as unknown as Request, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});