import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Pet",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    homeType: {
      type: String,
      required: true,
      trim: true,
    },
    householdSize: {
      type: String,
      required: true,
      trim: true,
    },
    hasChildren: {
      type: String,
      required: true,
      trim: true,
    },
    hasOtherPets: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    dailySchedule: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    carePlan: {
      type: String,
      required: true,
      trim: true,
    },
    financialPlan: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending_review", "approved", "rejected"],
      default: "pending_review",
    },
  },
  {
    timestamps: true,
  },
);

export const AdoptionModel = mongoose.model("Adoption", adoptionSchema);
