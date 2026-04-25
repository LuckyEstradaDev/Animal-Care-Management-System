import type {IAdoption} from "../interfaces/IAdoption.js";
import {AdoptionRepository} from "../repositories/AdoptionRepository.js";

const adoptionRepository = new AdoptionRepository();

export const createAdoption = async (data: IAdoption) => {
  return adoptionRepository.create(data);
};

export const getAdoptionsByUser = async (userId: string) => {
  return adoptionRepository.getByUser(userId);
};
