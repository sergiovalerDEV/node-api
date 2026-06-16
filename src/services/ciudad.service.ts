import * as ciudadRepo from '../repositories/ciudad.repository';
import type { CiudadAttributes } from '../models/ciudad.model';
import { NotFoundError } from '../errors/NotFoundError';

export const getAllCiudades = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await ciudadRepo.findAllCiudades(offset, limit);
  return { data: rows, total: count };
};

export const getCiudadById = async (id: number) => {
  const ciudad = await ciudadRepo.findCiudadById(id);
  if (!ciudad) throw new NotFoundError(`Ciudad con id ${id} no encontrada`);
  return ciudad;
};

export const createCiudad = async (data: Omit<CiudadAttributes, 'id'>) => {
  return ciudadRepo.createCiudad(data);
};

export const updateCiudad = async (id: number, data: Partial<Omit<CiudadAttributes, 'id'>>) => {
  const existe = await ciudadRepo.findCiudadById(id);
  if (!existe) throw new NotFoundError(`Ciudad con id ${id} no encontrada`);
  return ciudadRepo.updateCiudad(id, data);
};

export const deleteCiudad = async (id: number) => {
  const existe = await ciudadRepo.findCiudadById(id);
  if (!existe) throw new NotFoundError(`Ciudad con id ${id} no encontrada`);
  await ciudadRepo.deleteCiudad(id);
};
