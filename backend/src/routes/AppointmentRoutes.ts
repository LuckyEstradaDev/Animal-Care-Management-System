import express from "express";
import {createAppointmentController} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointmentController);

export default router;
