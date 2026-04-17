import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    type: {
      type: String,
    },
    scheduledDate: {
      type: Date,
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
