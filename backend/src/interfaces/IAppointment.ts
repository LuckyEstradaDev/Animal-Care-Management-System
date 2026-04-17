import mongoose from "mongoose";

export interface IAppointment extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  scheduledDate: Date;
}
