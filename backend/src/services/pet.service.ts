import {IPet} from "../interfaces/IPet.js";
import {PetRepository} from "../repositories/PetRepository.js";

let petRepository = new PetRepository();
export const createPet = async (data: IPet) => {
  const pet = await petRepository.create(data);
  return pet;
};

export const getAllPets = async () => {
  const pets = await petRepository.getAll();
  return pets;
};

export const getPetById = async (id: string) => {
  const pet = await petRepository.getById(id);
  return pet;
};

export const updatePet = async (id: string, data: Partial<IPet>) => {
  const pet = await petRepository.update(id, data);
  return pet;
};

export const deletePet = async (id: string) => {
  await petRepository.delete(id);
};
