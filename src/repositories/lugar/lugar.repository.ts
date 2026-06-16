import { Lugar } from '../../models';
import type { LugarAttributes } from '../../models/lugar/lugar.model';

export const findLugaresByCiudad = async (ciudad_id: number, offset: number, limit: number) => {
  return Lugar.findAndCountAll({
    where: { ciudad_id },
    limit,
    offset,
    order: [['id', 'ASC']],
  });
};

export const findLugarById = async (id: number) => {
  return Lugar.findByPk(id);
};

export const createLugar = async (data: Omit<LugarAttributes, 'id'>) => {
  return Lugar.create(data);
};

export const updateLugar = async (
  id: number,
  data: Partial<Omit<LugarAttributes, 'id'>>
) => {
  await Lugar.update(data, { where: { id } });
  return Lugar.findByPk(id);
};

export const deleteLugar = async (id: number) => {
  return Lugar.destroy({ where: { id } });
};
