export interface CreateAppointmentPayload {
  name: string;
  email: string;
  date: string;
  time: string;
  notes?: string;
}

export interface CreateAppointmentResponse {
  success: boolean;
  message: string;
  data?: any;
}

const API_BASE_URL = "http://localhost:3000/api/appointments";
// adjust if needed

export async function createAppointment(
  payload: CreateAppointmentPayload,
): Promise<CreateAppointmentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // handle non-2xx responses
      const errorText = await response.text();
      throw new Error(errorText || "Failed to create appointment");
    }

    const data: CreateAppointmentResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}
