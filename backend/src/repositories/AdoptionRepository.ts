import type {IAdoption} from "../interfaces/IAdoption.js";
import {AdoptionModel} from "../models/AdoptionModel.js";

export class AdoptionRepository {
  async create(data: IAdoption) {
    return AdoptionModel.create(data);
  }

  async getAll() {
    return AdoptionModel.find().sort({createdAt: -1}).populate("petId");
  }

  async getById(id: string) {
    return AdoptionModel.findById(id).populate("petId");
  }

  async getByUser(userId: string) {
    return AdoptionModel.find({userId}).sort({createdAt: -1}).populate("petId");
  }

  async update(id: string, data: Partial<IAdoption>) {
    return AdoptionModel.findByIdAndUpdate(id, data, {new: true}).populate(
      "petId",
    );
  }

  async delete(id: string) {
    return AdoptionModel.findByIdAndDelete(id);
  }
}
