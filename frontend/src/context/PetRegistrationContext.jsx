/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultPetSubmissions } from "../data/petRegistration";

const PET_SUBMISSIONS_KEY = "acm_pet_submissions";

const PetRegistrationContext = createContext(null);

function readStoredSubmissions() {
  if (typeof window === "undefined") return defaultPetSubmissions;

  try {
    const raw = window.localStorage.getItem(PET_SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : defaultPetSubmissions;
  } catch {
    return defaultPetSubmissions;
  }
}

export function PetRegistrationProvider({ children }) {
  const [submissions, setSubmissions] = useState(readStoredSubmissions);

  useEffect(() => {
    window.localStorage.setItem(PET_SUBMISSIONS_KEY, JSON.stringify(submissions));
  }, [submissions]);

  const registerPet = useCallback((submission) => {
    const nextSubmission = {
      id: `PET-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      submittedAt: "Today",
      status: "Pending review",
      ...submission,
    };

    setSubmissions((current) => [nextSubmission, ...current]);
    return nextSubmission;
  }, []);

  const value = useMemo(
    () => ({
      submissions,
      registerPet,
    }),
    [submissions, registerPet],
  );

  return (
    <PetRegistrationContext.Provider value={value}>
      {children}
    </PetRegistrationContext.Provider>
  );
}

export function usePetRegistration() {
  const context = useContext(PetRegistrationContext);

  if (!context) {
    throw new Error("usePetRegistration must be used within PetRegistrationProvider.");
  }

  return context;
}
