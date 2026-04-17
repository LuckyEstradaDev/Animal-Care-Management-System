import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
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
  availability: {
    type: String,
    enum: ["available", "not available"],
    default: "available",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const PetModel = mongoose.model("Pet", petSchema);
export default PetModel;
