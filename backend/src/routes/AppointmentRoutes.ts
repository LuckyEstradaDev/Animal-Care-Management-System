import express from "express";
import {
  createAppointmentController,
  deleteAppointmentController,
  getAllAppointmentsController,
  getAppointmentByIdController,
  getAppointmentsByUserController,
  updateAppointmentController,
} from "../controllers/AppointmentController.js";

const router = express.Router();

router.post("/", createAppointmentController);
router.get("/", getAllAppointmentsController);
router.get("/user/:userId", getAppointmentsByUserController);
router.get("/:id", getAppointmentByIdController);
router.put("/:id", updateAppointmentController);
router.delete("/:id", deleteAppointmentController);

export default router;
