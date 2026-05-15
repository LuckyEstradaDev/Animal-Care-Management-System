import {IAppointment} from "../interfaces/IAppointment.js";
import {UserModel} from "../models/UserModel.js";
import {AppointmentRepository} from "../repositories/AppointmentRepository.js";
import {sendAppointmentNotification} from "./email-service.js";

let appointmentRepository = new AppointmentRepository();

const maxTimeout = 2147483647;

async function sendAppointmentEmail(appointment: any) {
  try {
    const user = await UserModel.findById(appointment.userId);

    if (user) {
      await sendAppointmentNotification(
        user.email,
        `${user.firstName}`,
        appointment.service,
        appointment.appointmentDate,
        appointment.appointmentTime,
      );
    }
  } catch (error) {
    console.log("Failed to send appointment email", error);
  }
}

function scheduleAppointmentEmail(appointment: any) {
  const appointmentSchedule = new Date(
    `${appointment.appointmentDate}T${appointment.appointmentTime}`,
  );
  const delay = appointmentSchedule.getTime() - Date.now();

  if (delay <= 0) {
    sendAppointmentEmail(appointment);
    return;
  }

  if (delay > maxTimeout) {
    return;
  }

  setTimeout(() => {
    sendAppointmentEmail(appointment);
  }, delay);
}

export const createAppointment = async (data: IAppointment) => {
  const appointment = await appointmentRepository.create(data);
  scheduleAppointmentEmail(appointment);
  return appointment;
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
