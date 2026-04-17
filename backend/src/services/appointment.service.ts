import {IAppointment} from "../interfaces/IAppointment.js";
import {AppointmentRepository} from "../repositories/AppointmentRepository.js";

let appointmentRepository = new AppointmentRepository();

export const createAppointment = async (data: IAppointment) => {
  await appointmentRepository.create(data);
};
