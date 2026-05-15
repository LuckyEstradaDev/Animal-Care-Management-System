import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type: String,
      required: true,
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    weight: {
      type: Number,
      min: 0,
    },
    size: {
      type: String,
      trim: true,
    },
    temperament: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    medicalHistories: {
      type: [
        {
          illness: {type: String, trim: true},
          date: {type: String, trim: true},
          stillPresent: {type: Boolean, default: false},
          notes: {type: String, trim: true},
        },
      ],
      default: [],
    },
    medicationHistories: {
      type: [
        {
          medication: {type: String, trim: true},
          dosage: {type: String, trim: true},
          startDate: {type: String, trim: true},
          endDate: {type: String, trim: true},
          ongoing: {type: Boolean, default: false},
          notes: {type: String, trim: true},
        },
      ],
      default: [],
    },
    vaccinationRecords: {
      type: [
        {
          vaccine: {type: String, trim: true},
          date: {type: String, trim: true},
          nextDue: {type: String, trim: true},
          veterinarian: {type: String, trim: true},
          notes: {type: String, trim: true},
        },
      ],
      default: [],
    },
    registrationReason: {
      type: String,
      enum: ["adoption", "personal_use", "breeding", "rescue"],
      default: "personal_use",
      required: true,
    },
    reviewStatus: {
      type: String,
      enum: ["in_review", "approved", "rejected"],
      default: "in_review",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PetModel = mongoose.model("Pet", petSchema);
export default PetModel;
