import {IAppointment} from "../interfaces/IAppointment.js";
import {AppointmentModel} from "../models/AppointmentModel.js";

export class AppointmentRepository {
  async create(data: IAppointment) {
    return AppointmentModel.create(data);
  }

  async getByUser(userId: string) {
    return AppointmentModel.find({userId}).sort({createdAt: -1});
  }
}
