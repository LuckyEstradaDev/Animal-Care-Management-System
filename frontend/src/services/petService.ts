export interface MedicalHistoryItem {
  illness: string;
  date: string;
  stillPresent: boolean;
  notes?: string;
}

export interface MedicationHistoryItem {
  medication: string;
  dosage?: string;
  startDate?: string;
  endDate?: string;
  ongoing?: boolean;
  notes?: string;
}

export interface VaccinationRecordItem {
  vaccine: string;
  date: string;
  nextDue?: string;
  veterinarian?: string;
  notes?: string;
}

export interface Pet {
  _id?: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  size?: string;
  temperament?: string;
  description?: string;
  imageUrl?: string;
  medicalHistories?: MedicalHistoryItem[];
  medicationHistories?: MedicationHistoryItem[];
  vaccinationRecords?: VaccinationRecordItem[];
  registrationReason?: "adoption" | "personal_use" | "breeding" | "rescue";
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  message: string;
  pet?: T;
  pets?: T;
}
const BASE_URL = "http://localhost:5000/api/pets";

// helper to handle responses
const handleResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

// CREATE PET
export const createPet = async (petData: Pet): Promise<ApiResponse<Pet>> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(petData),
  });

  return handleResponse<ApiResponse<Pet>>(res);
};

// GET ALL PETS
export const getAllPets = async (): Promise<ApiResponse<Pet[]>> => {
  const res = await fetch(BASE_URL);
  return handleResponse<ApiResponse<Pet[]>>(res);
};

// GET PET BY ID
export const getPetById = async (id: string): Promise<ApiResponse<Pet>> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleResponse<ApiResponse<Pet>>(res);
};

// UPDATE PET
export const updatePet = async (
  id: string,
  updatedData: Partial<Pet>,
): Promise<ApiResponse<Pet>> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT", // or PATCH if your backend uses it
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  return handleResponse<ApiResponse<Pet>>(res);
};

// DELETE PET
export const deletePet = async (id: string): Promise<ApiResponse<null>> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  return handleResponse<ApiResponse<null>>(res);
};

export const getPetsByOwner = async (
  ownerId: string,
): Promise<ApiResponse<Pet[]>> => {
  const res = await fetch(`${BASE_URL}/owner/${ownerId}`);
  return handleResponse<ApiResponse<Pet[]>>(res);
};
