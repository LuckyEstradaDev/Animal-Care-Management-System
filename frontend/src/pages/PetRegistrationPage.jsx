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

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
              className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
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
              className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
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
              className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:ring-0 transition"
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
              Age
            </label>
            <Input
              id="age"
              type="number"
              min="0"
              value={form.age}
              onChange={(event) => setForm({...form, age: event.target.value})}
              placeholder="2"
              required
              className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
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
              className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
            />
          </div>
        </div>

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
              onChange={(event) => setForm({...form, size: event.target.value})}
              className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:ring-0 transition"
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
              className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:ring-0 transition"
            >
              <option>Calm</option>
              <option>Playful</option>
              <option>Gentle</option>
              <option>Active</option>
            </Select>
          </div>
        </div>

        {/* Temperament & Photo */}
        <div className="grid gap-3 sm:grid-cols-2">
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
              className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:ring-0 transition"
            >
              <option>Calm</option>
              <option>Playful</option>
              <option>Gentle</option>
              <option>Active</option>
            </Select>
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

        {/* Photo preview */}
        {form.photoUrl ? (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
            <img
              src={form.photoUrl}
              alt="Pet preview"
              className="h-48 w-full object-cover"
            />
          </div>
        ) : null}

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
            className="min-h-[80px] resize-y rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
          />
        </div>

        {/* Medical histories */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
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
                className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <Label htmlFor={`illness-${index}`}>Illness</Label>
                    <Input
                      id={`illness-${index}`}
                      value={entry.illness}
                      onChange={(event) =>
                        updateMedicalHistory(
                          index,
                          "illness",
                          event.target.value,
                        )
                      }
                      placeholder="Skin allergy"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`illness-date-${index}`}>When</Label>
                    <Input
                      id={`illness-date-${index}`}
                      type="date"
                      value={entry.date}
                      onChange={(event) =>
                        updateMedicalHistory(index, "date", event.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id={`stillPresent-${index}`}
                      type="checkbox"
                      checked={entry.stillPresent}
                      onChange={(event) =>
                        updateMedicalHistory(
                          index,
                          "stillPresent",
                          event.target.checked,
                        )
                      }
                      className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label
                      htmlFor={`stillPresent-${index}`}
                      className="text-sm text-zinc-600"
                    >
                      Ongoing
                    </label>
                  </div>
                </div>
                <div className="mt-3">
                  <Label htmlFor={`illness-notes-${index}`}>Notes</Label>
                  <Textarea
                    id={`illness-notes-${index}`}
                    value={entry.notes}
                    onChange={(event) =>
                      updateMedicalHistory(index, "notes", event.target.value)
                    }
                    placeholder="Notes for the veterinarian"
                    className="mt-1"
                  />
                </div>
                {form.medicalHistories.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeMedicalHistory(index)}
                    className="mt-3 text-xs font-medium text-rose-600 hover:text-rose-700"
                  >
                    Remove history
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Medication histories */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
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
                className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`medication-${index}`}>Medication</Label>
                    <Input
                      id={`medication-${index}`}
                      value={entry.medication}
                      onChange={(event) =>
                        updateMedicationHistory(
                          index,
                          "medication",
                          event.target.value,
                        )
                      }
                      placeholder="Flea prevention"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`dosage-${index}`}>Dosage</Label>
                    <Input
                      id={`dosage-${index}`}
                      value={entry.dosage}
                      onChange={(event) =>
                        updateMedicationHistory(
                          index,
                          "dosage",
                          event.target.value,
                        )
                      }
                      placeholder="5 mg"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 mt-3">
                  <div>
                    <Label htmlFor={`startDate-${index}`}>Start date</Label>
                    <Input
                      id={`startDate-${index}`}
                      type="date"
                      value={entry.startDate}
                      onChange={(event) =>
                        updateMedicationHistory(
                          index,
                          "startDate",
                          event.target.value,
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`endDate-${index}`}>End date</Label>
                    <Input
                      id={`endDate-${index}`}
                      type="date"
                      value={entry.endDate}
                      onChange={(event) =>
                        updateMedicationHistory(
                          index,
                          "endDate",
                          event.target.value,
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      id={`ongoing-${index}`}
                      type="checkbox"
                      checked={entry.ongoing}
                      onChange={(event) =>
                        updateMedicationHistory(
                          index,
                          "ongoing",
                          event.target.checked,
                        )
                      }
                      className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label
                      htmlFor={`ongoing-${index}`}
                      className="text-sm text-zinc-600"
                    >
                      Ongoing
                    </label>
                  </div>
                </div>
                <div className="mt-3">
                  <Label htmlFor={`medication-notes-${index}`}>Notes</Label>
                  <Textarea
                    id={`medication-notes-${index}`}
                    value={entry.notes}
                    onChange={(event) =>
                      updateMedicationHistory(
                        index,
                        "notes",
                        event.target.value,
                      )
                    }
                    placeholder="Medication instructions"
                    className="mt-1"
                  />
                </div>
                {form.medicationHistories.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeMedicationHistory(index)}
                    className="mt-3 text-xs font-medium text-rose-600 hover:text-rose-700"
                  >
                    Remove medication
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Vaccination records */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
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
                className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`vaccine-${index}`}>Vaccine</Label>
                    <Input
                      id={`vaccine-${index}`}
                      value={entry.vaccine}
                      onChange={(event) =>
                        updateVaccinationRecord(
                          index,
                          "vaccine",
                          event.target.value,
                        )
                      }
                      placeholder="Rabies"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`vac-date-${index}`}>
                      Date administered
                    </Label>
                    <Input
                      id={`vac-date-${index}`}
                      type="date"
                      value={entry.date}
                      onChange={(event) =>
                        updateVaccinationRecord(
                          index,
                          "date",
                          event.target.value,
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 mt-3">
                  <div>
                    <Label htmlFor={`nextDue-${index}`}>Next due date</Label>
                    <Input
                      id={`nextDue-${index}`}
                      type="date"
                      value={entry.nextDue}
                      onChange={(event) =>
                        updateVaccinationRecord(
                          index,
                          "nextDue",
                          event.target.value,
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`veterinarian-${index}`}>
                      Veterinarian
                    </Label>
                    <Input
                      id={`veterinarian-${index}`}
                      value={entry.veterinarian}
                      onChange={(event) =>
                        updateVaccinationRecord(
                          index,
                          "veterinarian",
                          event.target.value,
                        )
                      }
                      placeholder="Dr. Smith"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <Label htmlFor={`vac-notes-${index}`}>Notes</Label>
                  <Textarea
                    id={`vac-notes-${index}`}
                    value={entry.notes}
                    onChange={(event) =>
                      updateVaccinationRecord(
                        index,
                        "notes",
                        event.target.value,
                      )
                    }
                    placeholder="Vaccination notes"
                    className="mt-1"
                  />
                </div>
                {form.vaccinationRecords.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeVaccinationRecord(index)}
                    className="mt-3 text-xs font-medium text-rose-600 hover:text-rose-700"
                  >
                    Remove vaccination
                  </button>
                ) : null}
              </div>
            ))}
          </div>
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
            className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:ring-0 transition"
          >
            <option value="adoption">For Adoption</option>
            <option value="personal_use">For Personal Use</option>
            <option value="breeding">Breeding</option>
            <option value="rescue">Rescue</option>
          </Select>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? "Saving pet…" : "Submit pet"}
        </Button>
      </form>
    </div>
  );
}
