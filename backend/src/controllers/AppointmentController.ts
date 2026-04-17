import {createAppointment} from "../services/appointment.service.js";

export const createAppointmentController = async (req: any, res: any) => {
  try {
    await createAppointment(req.body);
    res.status(201).json({message: "Appointment created successfully"});
  } catch (error) {
    res.status(500).json({message: "Failed to create appointment", error});
  }
};
