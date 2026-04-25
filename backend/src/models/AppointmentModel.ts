import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  },
);

export const AppointmentModel = mongoose.model(
  "Appointment",
  appointmentSchema,
);
