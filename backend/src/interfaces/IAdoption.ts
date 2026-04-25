import mongoose from "mongoose";

export interface IAdoption extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  petId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  homeType: string;
  householdSize: string;
  hasChildren: string;
  hasOtherPets: string;
  experience: string;
  dailySchedule: string;
  reason: string;
  carePlan: string;
  financialPlan: string;
  status: "pending_review" | "approved" | "rejected";
}
