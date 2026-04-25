import {IPet} from "../interfaces/IPet.js";
import PetModel from "../models/PetModel.js";

export class PetRepository {
  async create(data: IPet) {
    const pet = await PetModel.create(data);
    return pet;
  }

  async getAll() {
    const pets = await PetModel.find();
    return pets;
  }

  async getById(id: string) {
    const pet = await PetModel.findById(id);
    return pet;
  }

  async update(id: string, data: Partial<IPet>) {
    const pet = await PetModel.findByIdAndUpdate(id, data, {new: true});
    return pet;
  }

  async delete(id: string) {
    await PetModel.findByIdAndDelete(id);
  }

  async getByOwner(ownerId: string) {
    const pets = await PetModel.find({owner: ownerId});
    return pets;
  }
}
