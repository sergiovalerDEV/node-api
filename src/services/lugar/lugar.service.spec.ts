import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NotFoundError } from '../../errors/NotFoundError/NotFoundError';
import * as ciudadRepo from '../../repositories/ciudad/ciudad.repository';
import * as lugarRepo from '../../repositories/lugar/lugar.repository';
import { createLugar, deleteLugar, getLugarById, getLugaresByCiudad, updateLugar } from './lugar.service';

jest.mock('../../repositories/ciudad/ciudad.repository');
jest.mock('../../repositories/lugar/lugar.repository');

describe('lugar service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('getLugaresByCiudad throws NotFoundError if ciudad does not exist', async () => {
        ((ciudadRepo.findCiudadById as unknown) as jest.MockedFunction<any>).mockResolvedValue(null);
        await expect(getLugaresByCiudad(1, 1, 10)).rejects.toThrow(NotFoundError);
    });

    it('getLugaresByCiudad returns paginated data when ciudad exists', async () => {
        ((ciudadRepo.findCiudadById as unknown) as jest.MockedFunction<any>).mockResolvedValue({ id: 1 });
        ((lugarRepo.findLugaresByCiudad as unknown) as jest.MockedFunction<any>).mockResolvedValue({ rows: [{ id: 2 }], count: 1 });
        const result = await getLugaresByCiudad(1, 1, 10);
        expect(result).toEqual({ data: [{ id: 2 }], total: 1 });
    });

    it('getLugarById throws NotFoundError for missing lugar', async () => {
        ((lugarRepo.findLugarById as unknown) as jest.MockedFunction<any>).mockResolvedValue(null);
        await expect(getLugarById(1)).rejects.toThrow(NotFoundError);
    });

    it('getLugarById returns lugar when found', async () => {
        const lugar = { id: 1, name: 'Prado' } as any;
        ((lugarRepo.findLugarById as unknown) as jest.MockedFunction<any>).mockResolvedValue(lugar);
        const result = await getLugarById(1);
        expect(result).toBe(lugar);
    });

    it('createLugar throws NotFoundError when ciudad_id is invalid', async () => {
        ((ciudadRepo.findCiudadById as unknown) as jest.MockedFunction<any>).mockResolvedValue(null);
        await expect(createLugar({ name: 'Parque', ciudad_id: 1 } as any)).rejects.toThrow(NotFoundError);
    });

    it('createLugar returns created lugar when ciudad exists', async () => {
        const lugar = { name: 'Parque', ciudad_id: 1 } as any;
        ((ciudadRepo.findCiudadById as unknown) as jest.MockedFunction<any>).mockResolvedValue({ id: 1 });
        ((lugarRepo.createLugar as unknown) as jest.MockedFunction<any>).mockResolvedValue(lugar);
        const result = await createLugar(lugar);
        expect(result).toBe(lugar);
    });

    it('updateLugar throws NotFoundError when lugar does not exist', async () => {
        ((lugarRepo.findLugarById as unknown) as jest.MockedFunction<any>).mockResolvedValue(null);
        await expect(updateLugar(1, {})).rejects.toThrow(NotFoundError);
    });

    it('updateLugar throws NotFoundError when new ciudad_id does not exist', async () => {
        ((lugarRepo.findLugarById as unknown) as jest.MockedFunction<any>).mockResolvedValue({ id: 1 });
        ((ciudadRepo.findCiudadById as unknown) as jest.MockedFunction<any>).mockResolvedValue(null);
        await expect(updateLugar(1, { ciudad_id: 2 })).rejects.toThrow(NotFoundError);
    });

    it('updateLugar returns updated lugar when lugar and ciudad exist', async () => {
        const updated = { id: 1, name: 'Parque' };
        ((lugarRepo.findLugarById as unknown) as jest.MockedFunction<any>).mockResolvedValue({ id: 1 });
        ((ciudadRepo.findCiudadById as unknown) as jest.MockedFunction<any>).mockResolvedValue({ id: 2 });
        ((lugarRepo.updateLugar as unknown) as jest.MockedFunction<any>).mockResolvedValue(updated);
        const result = await updateLugar(1, { ciudad_id: 2 });
        expect(result).toBe(updated);
    });

    it('deleteLugar throws NotFoundError when lugar does not exist', async () => {
        ((lugarRepo.findLugarById as unknown) as jest.MockedFunction<any>).mockResolvedValue(null);
        await expect(deleteLugar(1)).rejects.toThrow(NotFoundError);
    });

    it('deleteLugar resolves undefined when lugar exists', async () => {
        ((lugarRepo.findLugarById as unknown) as jest.MockedFunction<any>).mockResolvedValue({ id: 1 });
        ((lugarRepo.deleteLugar as unknown) as jest.MockedFunction<any>).mockResolvedValue(undefined);
        await expect(deleteLugar(1)).resolves.toBeUndefined();
    });
});