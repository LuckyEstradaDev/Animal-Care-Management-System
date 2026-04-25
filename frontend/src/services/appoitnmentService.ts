export interface CreateAppointmentPayload {
  userId: string;
  petId: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export interface Appointment {
  _id?: string;
  userId: string;
  petId: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  status: "pending" | "confirmed";
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentApiResponse<T> {
  message: string;
  appointment?: T;
  appointments?: T;
}

const API_BASE_URL = "http://localhost:5000/api/appointment";

export async function createAppointment(
  payload: CreateAppointmentPayload,
): Promise<AppointmentApiResponse<Appointment>> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create appointment");
  }

  return data;
}

export async function getAppointmentsByUser(
  userId: string,
): Promise<AppointmentApiResponse<Appointment[]>> {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch appointments");
  }

  return data;
}
