import {IAppointment} from "../interfaces/IAppointment.js";
import {AppointmentRepository} from "../repositories/AppointmentRepository.js";

let appointmentRepository = new AppointmentRepository();

export const createAppointment = async (data: IAppointment) => {
  return appointmentRepository.create(data);
};

export const getAllAppointments = async () => {
  return appointmentRepository.getAll();
};

export const getAppointmentById = async (id: string) => {
  return appointmentRepository.getById(id);
};

export const getAppointmentsByUser = async (userId: string) => {
  return appointmentRepository.getByUser(userId);
};

export const updateAppointment = async (
  id: string,
  data: Partial<IAppointment>,
) => {
  return appointmentRepository.update(id, data);
};

export const deleteAppointment = async (id: string) => {
  return appointmentRepository.delete(id);
};
