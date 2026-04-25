export interface AdoptionPayload {
  userId: string;
  petId: string;
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
}

export interface AdoptionRecord extends AdoptionPayload {
  _id?: string;
  status: "pending_review" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
  petId?: {
    _id?: string;
    name?: string;
    species?: string;
    breed?: string;
    imageUrl?: string;
  } | string;
}

export interface AdoptionApiResponse<T> {
  message: string;
  adoption?: T;
  adoptions?: T;
}

const API_BASE_URL = "http://localhost:5000/api/adoptions";

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export async function createAdoption(
  payload: AdoptionPayload,
): Promise<AdoptionApiResponse<AdoptionRecord>> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<AdoptionApiResponse<AdoptionRecord>>(response);
}

export async function getAdoptionsByUser(
  userId: string,
): Promise<AdoptionApiResponse<AdoptionRecord[]>> {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`);
  return handleResponse<AdoptionApiResponse<AdoptionRecord[]>>(response);
}
