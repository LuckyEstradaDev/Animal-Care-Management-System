import mongoose from "mongoose";

export interface IAppointment extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  petId: mongoose.Types.ObjectId;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  status: "pending" | "confirmed";
}
