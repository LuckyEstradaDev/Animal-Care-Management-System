import {
  createAppointment,
  getAppointmentsByUser,
} from "../services/appointment.service.js";

export const createAppointmentController = async (req: any, res: any) => {
  try {
    const appointment = await createAppointment(req.body);
    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({message: "Failed to create appointment", error});
  }
};

export const getAppointmentsByUserController = async (req: any, res: any) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({message: "Invalid request."});
    }

    const appointments = await getAppointmentsByUser(req.params.userId);
    return res.status(200).json({
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    return res
      .status(500)
      .json({message: "Failed to retrieve appointments", error});
  }
};
