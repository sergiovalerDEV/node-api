import { NotFoundError } from '../errors/NotFoundError';
import * as ciudadRepo from '../repositories/ciudad.repository';
import { createCiudad, deleteCiudad, getAllCiudades, getCiudadById, updateCiudad } from './ciudad.service';

jest.mock('../repositories/ciudad.repository');

describe('ciudad service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('getAllCiudades returns data and total from repository', async () => {
        jest.mocked(ciudadRepo.findAllCiudades).mockResolvedValue({ rows: [{ id: 1 }], count: 1 } as any);
        const result = await getAllCiudades(1, 10);
        expect(result).toEqual({ data: [{ id: 1 }], total: 1 });
    });

    it('getCiudadById throws NotFoundError when repository returns null', async () => {
        jest.mocked(ciudadRepo.findCiudadById).mockResolvedValue(null);
        await expect(getCiudadById(1)).rejects.toThrow(NotFoundError);
    });

    it('getCiudadById returns ciudad when found', async () => {
        const ciudad = { id: 1, name: 'Madrid' } as any;
        jest.mocked(ciudadRepo.findCiudadById).mockResolvedValue(ciudad);
        const result = await getCiudadById(1);
        expect(result).toBe(ciudad);
    });

    it('createCiudad delegates to repository', async () => {
        const city = { name: 'Madrid' } as any;
        jest.mocked(ciudadRepo.createCiudad).mockResolvedValue(city);
        const result = await createCiudad(city);
        expect(result).toBe(city);
    });

    it('updateCiudad throws NotFoundError if city does not exist', async () => {
        jest.mocked(ciudadRepo.findCiudadById).mockResolvedValue(null);
        await expect(updateCiudad(1, { name: 'Test' })).rejects.toThrow(NotFoundError);
    });

    it('updateCiudad returns updated city when city exists', async () => {
        const updated = { id: 1, name: 'Test' } as any;
        jest.mocked(ciudadRepo.findCiudadById).mockResolvedValue({ id: 1 } as any);
        jest.mocked(ciudadRepo.updateCiudad).mockResolvedValue(updated);
        const result = await updateCiudad(1, { name: 'Test' });
        expect(result).toBe(updated);
    });

    it('deleteCiudad throws NotFoundError when city does not exist', async () => {
        jest.mocked(ciudadRepo.findCiudadById).mockResolvedValue(null);
        await expect(deleteCiudad(1)).rejects.toThrow(NotFoundError);
    });

    it('deleteCiudad resolves when city exists', async () => {
        jest.mocked(ciudadRepo.findCiudadById).mockResolvedValue({ id: 1 } as any);
        jest.mocked(ciudadRepo.deleteCiudad).mockResolvedValue(null as any);
        await expect(deleteCiudad(1)).resolves.toBeUndefined();
    });
});