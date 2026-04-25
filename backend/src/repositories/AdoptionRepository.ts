import type {IAdoption} from "../interfaces/IAdoption.js";
import {AdoptionModel} from "../models/AdoptionModel.js";

export class AdoptionRepository {
  async create(data: IAdoption) {
    return AdoptionModel.create(data);
  }

  async getByUser(userId: string) {
    return AdoptionModel.find({userId}).sort({createdAt: -1}).populate("petId");
  }
}
