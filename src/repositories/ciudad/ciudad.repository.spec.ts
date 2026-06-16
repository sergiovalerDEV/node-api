import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Ciudad, Lugar } from '../../models';
import { createCiudad, deleteCiudad, findAllCiudades, findCiudadById, updateCiudad } from './ciudad.repository';

jest.mock('../../models', () => ({
  __esModule: true,
  Ciudad: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Lugar: {},
}));

describe('ciudad repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findAllCiudades forwards limit and offset to findAndCountAll', async () => {
    ((Ciudad.findAndCountAll as unknown) as jest.MockedFunction<any>).mockResolvedValue({ rows: [], count: 0 });
    await findAllCiudades(0, 10);
    expect(Ciudad.findAndCountAll).toHaveBeenCalledWith({ limit: 10, offset: 0, order: [['id', 'ASC']] });
  });

  it('findCiudadById includes lugares relation', async () => {
    ((Ciudad.findByPk as unknown) as jest.MockedFunction<any>).mockResolvedValue({ id: 1 });
    await findCiudadById(1);
    expect(Ciudad.findByPk).toHaveBeenCalledWith(1, { include: [{ model: Lugar, as: 'lugares' }] });
  });

  it('createCiudad delegates to Ciudad.create', async () => {
    const payload = { name: 'Madrid' } as any;
    ((Ciudad.create as unknown) as jest.MockedFunction<any>).mockResolvedValue(payload);
    const result = await createCiudad(payload);
    expect(result).toBe(payload);
  });

  it('updateCiudad updates and then finds by id', async () => {
    ((Ciudad.update as unknown) as jest.MockedFunction<any>).mockResolvedValue([1]);
    ((Ciudad.findByPk as unknown) as jest.MockedFunction<any>).mockResolvedValue({ id: 1 });
    await updateCiudad(1, { name: 'Madrid' });
    expect(Ciudad.findByPk).toHaveBeenCalledWith(1, { include: [{ model: Lugar, as: 'lugares' }] });
  });

  it('deleteCiudad calls destroy with id filter', async () => {
    ((Ciudad.destroy as unknown) as jest.MockedFunction<any>).mockResolvedValue(1);
    await deleteCiudad(2);
    expect(Ciudad.destroy).toHaveBeenCalledWith({ where: { id: 2 } });
  });
});