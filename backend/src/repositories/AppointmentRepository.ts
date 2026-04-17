import {IAppointment} from "../interfaces/IAppointment.js";
import {AppointmentModel} from "../models/AppointmentModel.js";

export class AppointmentRepository {
  async create(data: IAppointment) {
    await AppointmentModel.create(data);
  }
}
