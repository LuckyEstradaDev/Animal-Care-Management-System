import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {Input} from "../components/ui/input";
import {Label} from "../components/ui/label";
import {Select} from "../components/ui/select";
import {Textarea} from "../components/ui/textarea";
import {useAuth} from "../context/AuthContext";
import {createPet, getPetsByOwner} from "../services/petService";

const initialForm = {
  petName: "",
  species: "Dog",
  breed: "",
  age: "",
  weight: "",
  size: "Medium",
  temperament: "Calm",
  description: "",
  registrationReason: "personal_use",
  photoUrl: "",
  medicalHistories: [
    {
      illness: "",
      date: "",
      stillPresent: false,
      notes: "",
    },
  ],
  medicationHistories: [
    {
      medication: "",
      dosage: "",
      startDate: "",
      endDate: "",
      ongoing: false,
      notes: "",
    },
  ],
  vaccinationRecords: [
    {
      vaccine: "",
      date: "",
      nextDue: "",
      veterinarian: "",
      notes: "",
    },
  ],
};

export default function PetRegistrationPage() {
  const {currentUser, isAuthenticated} = useAuth();
  const [form, setForm] = useState(initialForm);
  const [registeredPets, setRegisteredPets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  function handlePhotoPick(event) {
    const [file] = event.target.files ?? [];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        photoUrl: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  }

  function updateMedicalHistory(index, field, value) {
    setForm((current) => {
      const medicalHistories = [...current.medicalHistories];
      medicalHistories[index] = {
        ...medicalHistories[index],
        [field]: value,
      };
      return {...current, medicalHistories};
    });
  }

  function addMedicalHistory() {
    setForm((current) => ({
      ...current,
      medicalHistories: [
        ...current.medicalHistories,
        {
          illness: "",
          date: "",
          stillPresent: false,
          notes: "",
        },
      ],
    }));
  }

  function removeMedicalHistory(index) {
    setForm((current) => ({
      ...current,
      medicalHistories: current.medicalHistories.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  function updateMedicationHistory(index, field, value) {
    setForm((current) => {
      const medicationHistories = [...current.medicationHistories];
      medicationHistories[index] = {
        ...medicationHistories[index],
        [field]: value,
      };
      return {...current, medicationHistories};
    });
  }

  function addMedicationHistory() {
    setForm((current) => ({
      ...current,
      medicationHistories: [
        ...current.medicationHistories,
        {
          medication: "",
          dosage: "",
          startDate: "",
          endDate: "",
          ongoing: false,
          notes: "",
        },
      ],
    }));
  }

  function removeMedicationHistory(index) {
    setForm((current) => ({
      ...current,
      medicationHistories: current.medicationHistories.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  function updateVaccinationRecord(index, field, value) {
    setForm((current) => {
      const vaccinationRecords = [...current.vaccinationRecords];
      vaccinationRecords[index] = {
        ...vaccinationRecords[index],
        [field]: value,
      };
      return {...current, vaccinationRecords};
    });
  }

  function addVaccinationRecord() {
    setForm((current) => ({
      ...current,
      vaccinationRecords: [
        ...current.vaccinationRecords,
        {
          vaccine: "",
          date: "",
          nextDue: "",
          veterinarian: "",
          notes: "",
        },
      ],
    }));
  }

  function removeVaccinationRecord(index) {
    setForm((current) => ({
      ...current,
      vaccinationRecords: current.vaccinationRecords.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  useEffect(() => {
    async function loadPets() {
      if (!currentUser?.id) {
        setRegisteredPets([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const response = await getPetsByOwner(currentUser.id);
        setRegisteredPets(response.pets ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load your pets.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPets();
  }, [currentUser?.id]);

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentUser?.id) {
      setError("No signed-in user was found for this session.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await createPet({
        name: form.petName.trim(),
        species: form.species,
        breed: form.breed.trim(),
        age: form.age ? Number.parseInt(form.age, 10) : undefined,
        weight: form.weight ? Number.parseFloat(form.weight) : undefined,
        size: form.size,
        temperament: form.temperament,
        description: form.description.trim(),
        imageUrl: form.photoUrl.trim(),
        medicalHistories: form.medicalHistories.filter(
          (entry) => entry.illness || entry.date || entry.notes,
        ),
        medicationHistories: form.medicationHistories.filter(
          (entry) =>
            entry.medication ||
            entry.dosage ||
            entry.startDate ||
            entry.endDate ||
            entry.notes,
        ),
        vaccinationRecords: form.vaccinationRecords.filter(
          (entry) => entry.vaccine || entry.date || entry.notes,
        ),
        registrationReason: form.registrationReason,
        reviewStatus: "in_review",
        owner: currentUser.id,
      });

      if (response.pet) {
        setRegisteredPets((current) => [response.pet, ...current]);
      }

      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register pet.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Register a pet
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fill in your pet's details to submit for review.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* ── Left: Photo ── */}
          <div className="flex flex-col gap-3">
            <div className="aspect-square w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
              {form.photoUrl ? (
                <img
                  src={form.photoUrl}
                  alt="Pet preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7.5A1.5 1.5 0 014.5 6h.75A1.5 1.5 0 007.5 4.5h9A1.5 1.5 0 0118 6h.75A1.5 1.5 0 0121 7.5v10A1.5 1.5 0 0119.5 19h-15A1.5 1.5 0 013 17.5v-10z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11.25a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-xs font-medium">No photo yet</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="photoFile"
                className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
              >
                Pet photo
              </label>
              <Input
                id="photoFile"
                type="file"
                accept="image/*"
                onChange={handlePhotoPick}
                className="rounded-xl border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-xs file:font-medium file:text-zinc-700 transition focus:border-zinc-900 focus:ring-0"
              />
              <p className="text-xs text-zinc-400">
                Pick an image and we'll attach it to this pet profile.
              </p>
            </div>
          </div>

          {/* ── Right: Basic details ── */}
          <div className="flex flex-col gap-4">
            {/* Name & Breed */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="petName"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Pet name
                </label>
                <Input
                  id="petName"
                  value={form.petName}
                  onChange={(event) =>
                    setForm({...form, petName: event.target.value})
                  }
                  placeholder="Coco"
                  required
                  className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="breed"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Breed
                </label>
                <Input
                  id="breed"
                  value={form.breed}
                  onChange={(event) =>
                    setForm({...form, breed: event.target.value})
                  }
                  placeholder="Mixed Breed"
                  required
                  className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                />
              </div>
            </div>

            {/* Species, Age, Weight */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="species"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Species
                </label>
                <Select
                  id="species"
                  value={form.species}
                  onChange={(event) =>
                    setForm({...form, species: event.target.value})
                  }
                  className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:ring-0 transition"
                >
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Rabbit</option>
                  <option>Bird</option>
                  <option>Other</option>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="age"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Age (yrs)
                </label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={(event) =>
                    setForm({...form, age: event.target.value})
                  }
                  placeholder="2"
                  required
                  className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="weight"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Weight (kg)
                </label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.weight}
                  onChange={(event) =>
                    setForm({...form, weight: event.target.value})
                  }
                  placeholder="12.5"
                  className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                />
              </div>
            </div>

            {/* Size & Temperament */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="size"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Size
                </label>
                <Select
                  id="size"
                  value={form.size}
                  onChange={(event) =>
                    setForm({...form, size: event.target.value})
                  }
                  className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:ring-0 transition"
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="temperament"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Temperament
                </label>
                <Select
                  id="temperament"
                  value={form.temperament}
                  onChange={(event) =>
                    setForm({...form, temperament: event.target.value})
                  }
                  className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:ring-0 transition"
                >
                  <option>Calm</option>
                  <option>Playful</option>
                  <option>Gentle</option>
                  <option>Active</option>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="description"
                className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  setForm({...form, description: event.target.value})
                }
                placeholder="Tell us about the pet's personality, habits, and care needs."
                required
                className="min-h-[100px] resize-y rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
              />
            </div>

            {/* Registration reason */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="reason"
                className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
              >
                Registration reason
              </label>
              <Select
                id="reason"
                value={form.registrationReason}
                onChange={(event) =>
                  setForm({...form, registrationReason: event.target.value})
                }
                className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:ring-0 transition"
              >
                <option value="adoption">For Adoption</option>
                <option value="personal_use">For Personal Use</option>
                <option value="breeding">Breeding</option>
                <option value="rescue">Rescue</option>
              </Select>
            </div>
          </div>
        </div>

        {/* ── Medical histories ── */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Medical histories
              </p>
              <p className="text-xs text-zinc-500">
                Add any illness history, when it happened, and whether it still
                applies.
              </p>
            </div>
            <button
              type="button"
              onClick={addMedicalHistory}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              + Add history
            </button>
          </div>
          <div className="space-y-4">
            {form.medicalHistories.map((entry, index) => (
              <div
                key={`medical-${index}`}
                className="rounded-xl border border-zinc-100 bg-zinc-50 p-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`illness-${index}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                    >
                      Illness
                    </label>
                    <Input
                      id={`illness-${index}`}
                      value={entry.illness}
                      onChange={(e) =>
                        updateMedicalHistory(index, "illness", e.target.value)
                      }
                      placeholder="Skin allergy"
                      className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`illness-date-${index}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                    >
                      When
                    </label>
                    <Input
                      id={`illness-date-${index}`}
                      type="date"
                      value={entry.date}
                      onChange={(e) =>
                        updateMedicalHistory(index, "date", e.target.value)
                      }
                      className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:ring-0 transition"
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-1.5">
                  <label
                    htmlFor={`illness-notes-${index}`}
                    className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                  >
                    Notes
                  </label>
                  <Textarea
                    id={`illness-notes-${index}`}
                    value={entry.notes}
                    onChange={(e) =>
                      updateMedicalHistory(index, "notes", e.target.value)
                    }
                    placeholder="Notes for the veterinarian"
                    className="min-h-[64px] resize-y rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                    <input
                      id={`stillPresent-${index}`}
                      type="checkbox"
                      checked={entry.stillPresent}
                      onChange={(e) =>
                        updateMedicalHistory(
                          index,
                          "stillPresent",
                          e.target.checked,
                        )
                      }
                      className="h-4 w-4 rounded border-zinc-300"
                    />
                    Ongoing
                  </label>
                  {form.medicalHistories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicalHistory(index)}
                      className="text-xs font-medium text-red-500 hover:text-red-600 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Medication histories ── */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Medication histories
              </p>
              <p className="text-xs text-zinc-500">
                Record medicines, dosages, start/end dates, and ongoing
                treatment.
              </p>
            </div>
            <button
              type="button"
              onClick={addMedicationHistory}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              + Add medication
            </button>
          </div>
          <div className="space-y-4">
            {form.medicationHistories.map((entry, index) => (
              <div
                key={`medication-${index}`}
                className="rounded-xl border border-zinc-100 bg-zinc-50 p-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`medication-${index}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                    >
                      Medication
                    </label>
                    <Input
                      id={`medication-${index}`}
                      value={entry.medication}
                      onChange={(e) =>
                        updateMedicationHistory(
                          index,
                          "medication",
                          e.target.value,
                        )
                      }
                      placeholder="Flea prevention"
                      className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`dosage-${index}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                    >
                      Dosage
                    </label>
                    <Input
                      id={`dosage-${index}`}
                      value={entry.dosage}
                      onChange={(e) =>
                        updateMedicationHistory(index, "dosage", e.target.value)
                      }
                      placeholder="5 mg"
                      className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                    />
                  </div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`startDate-${index}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                    >
                      Start date
                    </label>
                    <Input
                      id={`startDate-${index}`}
                      type="date"
                      value={entry.startDate}
                      onChange={(e) =>
                        updateMedicationHistory(
                          index,
                          "startDate",
                          e.target.value,
                        )
                      }
                      className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:ring-0 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`endDate-${index}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                    >
                      End date
                    </label>
                    <Input
                      id={`endDate-${index}`}
                      type="date"
                      value={entry.endDate}
                      onChange={(e) =>
                        updateMedicationHistory(
                          index,
                          "endDate",
                          e.target.value,
                        )
                      }
                      className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:ring-0 transition"
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-1.5">
                  <label
                    htmlFor={`medication-notes-${index}`}
                    className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                  >
                    Notes
                  </label>
                  <Textarea
                    id={`medication-notes-${index}`}
                    value={entry.notes}
                    onChange={(e) =>
                      updateMedicationHistory(index, "notes", e.target.value)
                    }
                    placeholder="Medication instructions"
                    className="min-h-[64px] resize-y rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                    <input
                      id={`ongoing-${index}`}
                      type="checkbox"
                      checked={entry.ongoing}
                      onChange={(e) =>
                        updateMedicationHistory(
                          index,
                          "ongoing",
                          e.target.checked,
                        )
                      }
                      className="h-4 w-4 rounded border-zinc-300"
                    />
                    Ongoing
                  </label>
                  {form.medicationHistories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicationHistory(index)}
                      className="text-xs font-medium text-red-500 hover:text-red-600 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Vaccination records ── */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Vaccination records
              </p>
              <p className="text-xs text-zinc-500">
                Record vaccinations, dates, and next due dates.
              </p>
            </div>
            <button
              type="button"
              onClick={addVaccinationRecord}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              + Add vaccination
            </button>
          </div>
          <div className="space-y-4">
            {form.vaccinationRecords.map((entry, index) => (
              <div
                key={`vaccination-${index}`}
                className="rounded-xl border border-zinc-100 bg-zinc-50 p-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`vaccine-${index}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                    >
                      Vaccine
                    </label>
                    <Input
                      id={`vaccine-${index}`}
                      value={entry.vaccine}
                      onChange={(e) =>
                        updateVaccinationRecord(
                          index,
                          "vaccine",
                          e.target.value,
                        )
                      }
                      placeholder="Rabies"
                      className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`vac-date-${index}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                    >
                      Date administered
                    </label>
                    <Input
                      id={`vac-date-${index}`}
                      type="date"
                      value={entry.date}
                      onChange={(e) =>
                        updateVaccinationRecord(index, "date", e.target.value)
                      }
                      className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:ring-0 transition"
                    />
                  </div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`nextDue-${index}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                    >
                      Next due date
                    </label>
                    <Input
                      id={`nextDue-${index}`}
                      type="date"
                      value={entry.nextDue}
                      onChange={(e) =>
                        updateVaccinationRecord(
                          index,
                          "nextDue",
                          e.target.value,
                        )
                      }
                      className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:ring-0 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`veterinarian-${index}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                    >
                      Veterinarian
                    </label>
                    <Input
                      id={`veterinarian-${index}`}
                      value={entry.veterinarian}
                      onChange={(e) =>
                        updateVaccinationRecord(
                          index,
                          "veterinarian",
                          e.target.value,
                        )
                      }
                      placeholder="Dr. Smith"
                      className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-1.5">
                  <label
                    htmlFor={`vac-notes-${index}`}
                    className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                  >
                    Notes
                  </label>
                  <Textarea
                    id={`vac-notes-${index}`}
                    value={entry.notes}
                    onChange={(e) =>
                      updateVaccinationRecord(index, "notes", e.target.value)
                    }
                    placeholder="Vaccination notes"
                    className="min-h-[64px] resize-y rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                  />
                </div>
                {form.vaccinationRecords.length > 1 && (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeVaccinationRecord(index)}
                      className="text-xs font-medium text-red-500 hover:text-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl py-3 text-sm font-medium transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? "Saving pet…" : "Submit pet"}
        </Button>
      </form>
    </div>
  );
}
