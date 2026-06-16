import { Lugar } from '../models';
import { createLugar, deleteLugar, findLugarById, findLugaresByCiudad, updateLugar } from './lugar.repository';

jest.mock('../models', () => ({
    __esModule: true,
    Lugar: {
        findAndCountAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
}));

describe('lugar repository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('findLugaresByCiudad forwards ciudad_id offset and limit', async () => {
        jest.mocked(Lugar.findAndCountAll).mockResolvedValue({ rows: [], count: 0 } as any);
        await findLugaresByCiudad(1, 0, 10);
        expect(Lugar.findAndCountAll).toHaveBeenCalledWith({ where: { ciudad_id: 1 }, limit: 10, offset: 0, order: [['id', 'ASC']] });
    });

    it('findLugarById delegates to findByPk', async () => {
        jest.mocked(Lugar.findByPk).mockResolvedValue({ id: 1 } as any);
        await findLugarById(1);
        expect(Lugar.findByPk).toHaveBeenCalledWith(1);
    });

    it('createLugar delegates to Lugar.create', async () => {
        const data = { name: 'Parque' } as any;
        jest.mocked(Lugar.create).mockResolvedValue(data);
        const result = await createLugar(data);
        expect(result).toBe(data);
    });

    it('updateLugar updates and then returns findByPk result', async () => {
        jest.mocked(Lugar.update).mockResolvedValue([1] as any);
        jest.mocked(Lugar.findByPk).mockResolvedValue({ id: 2 } as any);
        await updateLugar(2, { name: 'Parque' });
        expect(Lugar.findByPk).toHaveBeenCalledWith(2);
    });

    it('deleteLugar calls destroy with id filter', async () => {
        jest.mocked(Lugar.destroy).mockResolvedValue(1 as any);
        await deleteLugar(3);
        expect(Lugar.destroy).toHaveBeenCalledWith({ where: { id: 3 } });
    });
});