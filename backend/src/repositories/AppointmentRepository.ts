import {IAppointment} from "../interfaces/IAppointment.js";
import {AppointmentModel} from "../models/AppointmentModel.js";

export class AppointmentRepository {
  async create(data: IAppointment) {
    return AppointmentModel.create(data);
  }

  async getAll() {
    return AppointmentModel.find().sort({createdAt: -1});
  }

  async getById(id: string) {
    return AppointmentModel.findById(id);
  }

  async getByUser(userId: string) {
    return AppointmentModel.find({userId}).sort({createdAt: -1});
  }

  async update(id: string, data: Partial<IAppointment>) {
    return AppointmentModel.findByIdAndUpdate(id, data, {new: true});
  }

  async delete(id: string) {
    return AppointmentModel.findByIdAndDelete(id);
  }
}
