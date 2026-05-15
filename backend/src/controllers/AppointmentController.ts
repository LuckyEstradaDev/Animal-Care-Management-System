import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByUser,
  updateAppointment,
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

export const getAllAppointmentsController = async (req: any, res: any) => {
  try {
    const appointments = await getAllAppointments();
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

export const getAppointmentByIdController = async (req: any, res: any) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({message: "Invalid request."});
    }

    const appointment = await getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({message: "Appointment not found."});
    }

    return res.status(200).json({
      message: "Appointment retrieved successfully",
      appointment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({message: "Failed to retrieve appointment", error});
  }
};

export const updateAppointmentController = async (req: any, res: any) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({message: "Invalid request."});
    }

    const appointment = await updateAppointment(req.params.id, req.body);
    if (!appointment) {
      return res.status(404).json({message: "Appointment not found."});
    }

    return res.status(200).json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({message: "Failed to update appointment", error});
  }
};

export const deleteAppointmentController = async (req: any, res: any) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({message: "Invalid request."});
    }

    const appointment = await deleteAppointment(req.params.id);
    if (!appointment) {
      return res.status(404).json({message: "Appointment not found."});
    }

    return res.status(200).json({
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({message: "Failed to delete appointment", error});
  }
};
