import * as lugarRepo from '../../repositories/lugar/lugar.repository';
import * as ciudadRepo from '../../repositories/ciudad/ciudad.repository';
import type { LugarAttributes } from '../../models/lugar/lugar.model';
import { NotFoundError } from '../../errors/NotFoundError/NotFoundError';

export const getLugaresByCiudad = async (ciudad_id: number, page: number, limit: number) => {
  const ciudad = await ciudadRepo.findCiudadById(ciudad_id);
  if (!ciudad) throw new NotFoundError(`Ciudad con id ${ciudad_id} no encontrada`);
  const offset = (page - 1) * limit;
  const { rows, count } = await lugarRepo.findLugaresByCiudad(ciudad_id, offset, limit);
  return { data: rows, total: count };
};

export const getLugarById = async (id: number) => {
  const lugar = await lugarRepo.findLugarById(id);
  if (!lugar) throw new NotFoundError(`Lugar con id ${id} no encontrado`);
  return lugar;
};

export const createLugar = async (data: Omit<LugarAttributes, 'id'>) => {
  const ciudad = await ciudadRepo.findCiudadById(data.ciudad_id);
  if (!ciudad) throw new NotFoundError(`Ciudad con id ${data.ciudad_id} no encontrada`);
  return lugarRepo.createLugar(data);
};

export const updateLugar = async (id: number, data: Partial<Omit<LugarAttributes, 'id'>>) => {
  const lugar = await lugarRepo.findLugarById(id);
  if (!lugar) throw new NotFoundError(`Lugar con id ${id} no encontrado`);
  if (data.ciudad_id !== undefined) {
    const ciudad = await ciudadRepo.findCiudadById(data.ciudad_id);
    if (!ciudad) throw new NotFoundError(`Ciudad con id ${data.ciudad_id} no encontrada`);
  }
  return lugarRepo.updateLugar(id, data);
};

export const deleteLugar = async (id: number) => {
  const lugar = await lugarRepo.findLugarById(id);
  if (!lugar) throw new NotFoundError(`Lugar con id ${id} no encontrado`);
  await lugarRepo.deleteLugar(id);
};