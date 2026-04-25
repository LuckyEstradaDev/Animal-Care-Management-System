import mongoose from "mongoose";

export interface IPet extends mongoose.Document {
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  description?: string;
  imageUrl?: string;
  owner: mongoose.Types.ObjectId;
}
