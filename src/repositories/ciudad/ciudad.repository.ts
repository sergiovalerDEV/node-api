import { Ciudad, Lugar } from '../../models';
import type { CiudadAttributes } from '../../models/ciudad/ciudad.model';

export const findAllCiudades = async (offset: number, limit: number) => {
  return Ciudad.findAndCountAll({
    limit,
    offset,
    order: [['id', 'ASC']],
  });
};

export const findCiudadById = async (id: number) => {
  return Ciudad.findByPk(id, {
    include: [{ model: Lugar, as: 'lugares' }],
  });
};

export const createCiudad = async (data: Omit<CiudadAttributes, 'id'>) => {
  return Ciudad.create(data);
};

export const updateCiudad = async (
  id: number,
  data: Partial<Omit<CiudadAttributes, 'id'>>
) => {
  await Ciudad.update(data, { where: { id } });
  return Ciudad.findByPk(id, {
    include: [{ model: Lugar, as: 'lugares' }],
  });
};

export const deleteCiudad = async (id: number) => {
  return Ciudad.destroy({ where: { id } });
};
