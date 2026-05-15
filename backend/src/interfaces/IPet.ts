import mongoose from "mongoose";

export interface MedicalHistoryEntry {
  illness: string;
  date: string;
  stillPresent: boolean;
  notes?: string;
}

export interface MedicationHistoryEntry {
  medication: string;
  dosage?: string;
  startDate?: string;
  endDate?: string;
  ongoing?: boolean;
  notes?: string;
}

export interface VaccinationRecord {
  vaccine: string;
  date: string;
  nextDue?: string;
  veterinarian?: string;
  notes?: string;
}

export interface IPet extends mongoose.Document {
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  size?: string;
  temperament?: string;
  description?: string;
  imageUrl?: string;
  medicalHistories?: MedicalHistoryEntry[];
  medicationHistories?: MedicationHistoryEntry[];
  vaccinationRecords?: VaccinationRecord[];
  registrationReason: "adoption" | "personal_use" | "breeding" | "rescue";
  reviewStatus: "in_review" | "approved" | "rejected";
  owner: mongoose.Types.ObjectId;
}
