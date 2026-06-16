import seed from './seed';

jest.mock('./models', () => ({
    __esModule: true,
    Ciudad: { create: jest.fn() },
    Lugar: { create: jest.fn() },
}));

import { Ciudad, Lugar } from './models';

describe('seed', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('creates 3 ciudades and 9 lugares', async () => {
        jest.mocked(Ciudad.create)
            .mockResolvedValueOnce({ id: 1 } as any)
            .mockResolvedValueOnce({ id: 2 } as any)
            .mockResolvedValueOnce({ id: 3 } as any);
        jest.mocked(Lugar.create).mockResolvedValue({} as any);

        await seed();

        expect(Ciudad.create).toHaveBeenCalledTimes(3);
        expect(Lugar.create).toHaveBeenCalledTimes(9);
    });

    it('creates madrid with correct data', async () => {
        jest.mocked(Ciudad.create)
            .mockResolvedValueOnce({ id: 1 } as any)
            .mockResolvedValueOnce({ id: 2 } as any)
            .mockResolvedValueOnce({ id: 3 } as any);
        jest.mocked(Lugar.create).mockResolvedValue({} as any);

        await seed();

        expect(Ciudad.create).toHaveBeenNthCalledWith(1, expect.objectContaining({ name: 'Madrid', country: 'España' }));
    });

    it('assigns madrid id to first 3 lugares', async () => {
        jest.mocked(Ciudad.create)
            .mockResolvedValueOnce({ id: 10 } as any)
            .mockResolvedValueOnce({ id: 20 } as any)
            .mockResolvedValueOnce({ id: 30 } as any);
        jest.mocked(Lugar.create).mockResolvedValue({} as any);

        await seed();

        expect(Lugar.create).toHaveBeenNthCalledWith(1, expect.objectContaining({ ciudad_id: 10 }));
        expect(Lugar.create).toHaveBeenNthCalledWith(2, expect.objectContaining({ ciudad_id: 10 }));
        expect(Lugar.create).toHaveBeenNthCalledWith(3, expect.objectContaining({ ciudad_id: 10 }));
    });
});