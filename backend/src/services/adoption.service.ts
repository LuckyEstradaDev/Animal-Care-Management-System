import type {IAdoption} from "../interfaces/IAdoption.js";
import {AdoptionRepository} from "../repositories/AdoptionRepository.js";

const adoptionRepository = new AdoptionRepository();

export const createAdoption = async (data: IAdoption) => {
  return adoptionRepository.create(data);
};

export const getAllAdoptions = async () => {
  return adoptionRepository.getAll();
};

export const getAdoptionById = async (id: string) => {
  return adoptionRepository.getById(id);
};

export const getAdoptionsByUser = async (userId: string) => {
  return adoptionRepository.getByUser(userId);
};

export const updateAdoption = async (id: string, data: Partial<IAdoption>) => {
  return adoptionRepository.update(id, data);
};

export const deleteAdoption = async (id: string) => {
  return adoptionRepository.delete(id);
};
