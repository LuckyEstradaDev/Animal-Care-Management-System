import express from "express";
import {
  createAppointmentController,
  getAppointmentsByUserController,
} from "../controllers/AppointmentController.js";

const router = express.Router();

router.post("/", createAppointmentController);
router.get("/user/:userId", getAppointmentsByUserController);

export default router;
