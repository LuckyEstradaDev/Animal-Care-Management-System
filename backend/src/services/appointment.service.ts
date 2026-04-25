import {IAppointment} from "../interfaces/IAppointment.js";
import {AppointmentRepository} from "../repositories/AppointmentRepository.js";

let appointmentRepository = new AppointmentRepository();

export const createAppointment = async (data: IAppointment) => {
  return appointmentRepository.create(data);
};

export const getAppointmentsByUser = async (userId: string) => {
  return appointmentRepository.getByUser(userId);
};
