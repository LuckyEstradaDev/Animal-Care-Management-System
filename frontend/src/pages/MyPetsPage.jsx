import {useEffect, useMemo, useState} from "react";
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
import {Dialog} from "../components/ui/dialog";
import {Label} from "../components/ui/label";
import {Select} from "../components/ui/select";
import {Input} from "../components/ui/input";
import {Textarea} from "../components/ui/textarea";
import {StethoscopeIcon} from "../components/icons";
import {useAuth} from "../context/AuthContext";
import {getPetsByOwner, updatePet} from "../services/petService";

const fallbackImage = "https://via.placeholder.com/320x220?text=Pet";

const reviewStatusStyles = {
  approved: {
    label: "Approved",
    variant: "primary",
  },
  in_review: {
    label: "In review",
    variant: "warning",
  },
  rejected: {
    label: "Rejected",
    variant: "danger",
  },
};

function getReviewStatusMeta(status) {
  return (
    reviewStatusStyles[status] ?? {
      label: "Not reviewed",
      variant: "default",
    }
  );
}

function createPetSummary(pet) {
  const notes = pet.description
    ? pet.description
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const medicalHistory = pet.medicalHistories?.length
    ? pet.medicalHistories.map((entry) =>
        `${entry.illness}${entry.date ? ` (${entry.date})` : ""}${
          entry.stillPresent ? " (ongoing)" : ""
        }${entry.notes ? ` — ${entry.notes}` : ""}`.trim(),
      )
    : notes.length > 0
      ? notes
      : ["No medical notes recorded yet."];

  const treatments = pet.medicationHistories?.length
    ? pet.medicationHistories.map((entry) =>
        `${entry.medication}${entry.dosage ? ` — ${entry.dosage}` : ""}${
          entry.startDate ? ` ${entry.startDate}` : ""
        }${entry.endDate ? ` - ${entry.endDate}` : ""}${
          entry.ongoing ? " (ongoing)" : ""
        }${entry.notes ? ` — ${entry.notes}` : ""}`.trim(),
      )
    : pet.weight
      ? [`Current weight recorded at ${pet.weight} kg.`]
      : ["No treatment notes recorded yet."];

  const vaccinations = pet.vaccinationRecords?.length
    ? pet.vaccinationRecords.map((entry) => ({
        label: entry.vaccine,
        date: entry.date,
        status: entry.nextDue ? "Upcoming" : "Completed",
      }))
    : [];

  return {
    nextVisit: "No appointment yet",
    vaccinationRecords: vaccinations,
    medicalHistory,
    treatments,
  };
}

export default function MyPetsPage() {
  const {currentUser, isAuthenticated} = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPetId, setEditingPetId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    species: "Dog",
    breed: "",
    age: "",
    weight: "",
    description: "",
    registrationReason: "personal_use",
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
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadPets() {
      if (!currentUser?.id) {
        setPets([]);
        setSelectedPetId(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const response = await getPetsByOwner(currentUser.id);
        const ownerPets = response.pets ?? [];
        setPets(ownerPets);
        setSelectedPetId(ownerPets[0]?._id ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load pets.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPets();
  }, [currentUser?.id]);

  const selectedPet = useMemo(
    () => pets.find((pet) => pet._id === selectedPetId) ?? pets[0] ?? null,
    [pets, selectedPetId],
  );

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  function resetEditForm() {
    setEditForm({
      name: "",
      species: "Dog",
      breed: "",
      age: "",
      weight: "",
      description: "",
      registrationReason: "personal_use",
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
    });
  }

  async function openEditDialog(pet) {
    setEditingPetId(pet._id);
    setEditForm({
      name: pet.name || "",
      species: pet.species || "Dog",
      breed: pet.breed || "",
      age: pet.age?.toString() || "",
      weight: pet.weight?.toString() || "",
      description: pet.description || "",
      registrationReason: pet.registrationReason || "personal_use",
      medicalHistories:
        pet.medicalHistories?.length > 0
          ? pet.medicalHistories
          : [
              {
                illness: "",
                date: "",
                stillPresent: false,
                notes: "",
              },
            ],
      medicationHistories:
        pet.medicationHistories?.length > 0
          ? pet.medicationHistories
          : [
              {
                medication: "",
                dosage: "",
                startDate: "",
                endDate: "",
                ongoing: false,
                notes: "",
              },
            ],
    });
  }

  function closeEditDialog() {
    setEditingPetId(null);
    resetEditForm();
  }

  function updateEditField(field, value) {
    setEditForm((current) => ({...current, [field]: value}));
  }

  function updateEditMedicalHistory(index, field, value) {
    setEditForm((current) => {
      const medicalHistories = [...current.medicalHistories];
      medicalHistories[index] = {
        ...medicalHistories[index],
        [field]: value,
      };
      return {...current, medicalHistories};
    });
  }

  function addEditMedicalHistory() {
    setEditForm((current) => ({
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

  function removeEditMedicalHistory(index) {
    setEditForm((current) => ({
      ...current,
      medicalHistories: current.medicalHistories.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  function updateEditMedicationHistory(index, field, value) {
    setEditForm((current) => {
      const medicationHistories = [...current.medicationHistories];
      medicationHistories[index] = {
        ...medicationHistories[index],
        [field]: value,
      };
      return {...current, medicationHistories};
    });
  }

  function addEditMedicationHistory() {
    setEditForm((current) => ({
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

  function removeEditMedicationHistory(index) {
    setEditForm((current) => ({
      ...current,
      medicationHistories: current.medicationHistories.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  async function handleSavePet() {
    if (!editingPetId) return;

    try {
      setIsSaving(true);
      const updatedPet = {
        name: editForm.name.trim(),
        species: editForm.species,
        breed: editForm.breed.trim(),
        age: editForm.age ? Number.parseInt(editForm.age, 10) : undefined,
        weight: editForm.weight
          ? Number.parseFloat(editForm.weight)
          : undefined,
        description: editForm.description.trim(),
        registrationReason: editForm.registrationReason,
        medicalHistories: editForm.medicalHistories.filter(
          (entry) => entry.illness || entry.date || entry.notes,
        ),
        medicationHistories: editForm.medicationHistories.filter(
          (entry) =>
            entry.medication ||
            entry.dosage ||
            entry.startDate ||
            entry.endDate ||
            entry.notes,
        ),
      };

      await updatePet(editingPetId, updatedPet);
      setPets((current) =>
        current.map((pet) =>
          pet._id === editingPetId ? {...pet, ...updatedPet} : pet,
        ),
      );
      closeEditDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update pet.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Loading your pets...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!selectedPet) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-lg font-semibold text-slate-950">No pets yet</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Register a pet first and it will show up here automatically.
        </p>
      </div>
    );
  }

  const details = createPetSummary(selectedPet);
  const selectedReviewStatus = getReviewStatusMeta(selectedPet.reviewStatus);

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          My pets
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Select a pet to view their full profile and medical details.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        {/* ── Pet list ── */}
        <div className="flex flex-col gap-2">
          {pets.map((pet) => {
            const active = pet._id === selectedPet._id;
            const petDetails = createPetSummary(pet);
            const reviewStatus = getReviewStatusMeta(pet.reviewStatus);
            return (
              <button
                key={pet._id}
                type="button"
                onClick={() => setSelectedPetId(pet._id)}
                className={`w-full rounded-2xl border p-3 text-left transition duration-150 hover:-translate-y-0.5 ${
                  active
                    ? "border-emerald-600 bg-emerald-600 shadow-sm shadow-emerald-950/15"
                    : "border-zinc-200 bg-white hover:border-emerald-200 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={pet.imageUrl || fallbackImage}
                    alt={pet.name}
                    className="h-11 w-11 shrink-0 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-semibold ${active ? "text-white" : "text-zinc-900"}`}
                    >
                      {pet.name}
                    </p>
                    <p
                      className={`truncate text-xs mt-0.5 ${active ? "text-emerald-50" : "text-zinc-500"}`}
                    >
                      {pet.species} · {pet.breed || "Unknown breed"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={`rounded-lg px-2 py-0.5 text-[11px] font-medium ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {pet.registrationReason === "adoption"
                        ? "Adoption"
                        : "Personal"}
                    </span>
                    <Badge
                      variant={active ? "default" : reviewStatus.variant}
                      className={`px-2 py-0.5 text-[10px] ${
                        active ? "bg-white/20 text-white" : ""
                      }`}
                    >
                      {reviewStatus.label}
                    </Badge>
                  </div>
                </div>
                <div
                  className={`mt-2.5 flex items-center gap-1.5 text-xs ${active ? "text-emerald-50" : "text-zinc-500"}`}
                >
                  <StethoscopeIcon className="h-3.5 w-3.5" />
                  <span>Next visit: {petDetails.nextVisit}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Right panel ── */}
        <div className="space-y-5">
          {/* Pet hero row */}
          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={selectedPet.imageUrl || fallbackImage}
                alt={selectedPet.name}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {selectedPet.name}
                  </h2>
                  <Badge variant={selectedReviewStatus.variant}>
                    {selectedReviewStatus.label}
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {selectedPet.species} · {selectedPet.breed || "Unknown breed"}
                </p>
                <span className="mt-1.5 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                  Next visit {details.nextVisit}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditDialog(selectedPet)}
              className="self-start rounded-xl border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50 sm:self-auto"
            >
              Edit pet
            </Button>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {label: "Vaccinations", value: details.vaccinationRecords.length},
              {label: "History notes", value: details.medicalHistory.length},
              {label: "Treatments", value: details.treatments.length},
            ].map(({label, value}) => (
              <div
                key={label}
                className="rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-zinc-900">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Detail columns */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Vaccination records */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-zinc-900">
                Vaccination records
              </p>
              <div className="space-y-2">
                {details.vaccinationRecords.length > 0 ? (
                  details.vaccinationRecords.map((record) => (
                    <div
                      key={record.label}
                      className="rounded-xl border border-zinc-100 bg-zinc-50 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-zinc-900">
                          {record.label}
                        </p>
                        <span
                          className={`shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-medium ${
                            record.status === "Upcoming"
                              ? "border border-amber-200 bg-amber-50 text-amber-700"
                              : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {record.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">
                        {record.date}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-zinc-50 p-3 text-xs text-zinc-400">
                    No vaccination records available yet.
                  </div>
                )}
              </div>
            </div>

            {/* Medical history */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-zinc-900">
                Medical history
              </p>
              <div className="space-y-2">
                {details.medicalHistory.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-600"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Treatments */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-zinc-900">
                Treatments
              </p>
              <div className="space-y-2">
                {details.treatments.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-600"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit dialog ── */}
      <Dialog
        open={Boolean(editingPetId)}
        onOpenChange={(open) => {
          if (!open) closeEditDialog();
        }}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl shadow-zinc-900/20">
            <button
              type="button"
              onClick={closeEditDialog}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              ✕
            </button>

            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                handleSavePet();
              }}
            >
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Edit pet profile
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Update the pet information, medical records, and treatment
                  history.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="editName">Name</Label>
                  <Input
                    id="editName"
                    value={editForm.name}
                    onChange={(event) =>
                      updateEditField("name", event.target.value)
                    }
                    required
                    className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="editSpecies">Species</Label>
                  <Select
                    id="editSpecies"
                    value={editForm.species}
                    onChange={(event) =>
                      updateEditField("species", event.target.value)
                    }
                    className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                  >
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Rabbit</option>
                    <option>Bird</option>
                    <option>Other</option>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="editBreed">Breed</Label>
                  <Input
                    id="editBreed"
                    value={editForm.breed}
                    onChange={(event) =>
                      updateEditField("breed", event.target.value)
                    }
                    className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="editAge">Age</Label>
                    <Input
                      id="editAge"
                      type="number"
                      min="0"
                      value={editForm.age}
                      onChange={(event) =>
                        updateEditField("age", event.target.value)
                      }
                      className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="editWeight">Weight (kg)</Label>
                    <Input
                      id="editWeight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={editForm.weight}
                      onChange={(event) =>
                        updateEditField("weight", event.target.value)
                      }
                      className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={editForm.description}
                  onChange={(event) =>
                    updateEditField("description", event.target.value)
                  }
                  rows={4}
                  className="min-h-[120px] rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="editReason">Registration reason</Label>
                <Select
                  id="editReason"
                  value={editForm.registrationReason}
                  onChange={(event) =>
                    updateEditField("registrationReason", event.target.value)
                  }
                  className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                >
                  <option value="personal_use">Personal use</option>
                  <option value="adoption">For adoption</option>
                  <option value="breeding">Breeding</option>
                  <option value="rescue">Rescue</option>
                </Select>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Medical histories
                    </p>
                    <p className="text-xs text-zinc-500">
                      Track illnesses, when they happened, and whether they are
                      ongoing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addEditMedicalHistory}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-4">
                  {editForm.medicalHistories.map((entry, index) => (
                    <div
                      key={`medical-edit-${index}`}
                      className="space-y-3 rounded-2xl border border-zinc-100 bg-white p-4"
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor={`editMedicalIllness-${index}`}>
                            Illness
                          </Label>
                          <Input
                            id={`editMedicalIllness-${index}`}
                            value={entry.illness}
                            onChange={(event) =>
                              updateEditMedicalHistory(
                                index,
                                "illness",
                                event.target.value,
                              )
                            }
                            className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor={`editMedicalDate-${index}`}>
                            Date
                          </Label>
                          <Input
                            id={`editMedicalDate-${index}`}
                            type="date"
                            value={entry.date}
                            onChange={(event) =>
                              updateEditMedicalHistory(
                                index,
                                "date",
                                event.target.value,
                              )
                            }
                            className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`editMedicalOngoing-${index}`}
                          checked={entry.stillPresent}
                          onChange={(event) =>
                            updateEditMedicalHistory(
                              index,
                              "stillPresent",
                              event.target.checked,
                            )
                          }
                          className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label
                          htmlFor={`editMedicalOngoing-${index}`}
                          className="text-sm text-zinc-600"
                        >
                          Ongoing
                        </label>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`editMedicalNotes-${index}`}>
                          Notes
                        </Label>
                        <Textarea
                          id={`editMedicalNotes-${index}`}
                          value={entry.notes}
                          onChange={(event) =>
                            updateEditMedicalHistory(
                              index,
                              "notes",
                              event.target.value,
                            )
                          }
                          rows={3}
                          className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                        />
                      </div>
                      {editForm.medicalHistories.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeEditMedicalHistory(index)}
                          className="text-xs font-medium text-rose-600 hover:text-rose-700"
                        >
                          Remove history
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Medication histories
                    </p>
                    <p className="text-xs text-zinc-500">
                      Track medicines, doses, dates, and ongoing treatments.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addEditMedicationHistory}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-4">
                  {editForm.medicationHistories.map((entry, index) => (
                    <div
                      key={`medication-edit-${index}`}
                      className="space-y-3 rounded-2xl border border-zinc-100 bg-white p-4"
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor={`editMedicationName-${index}`}>
                            Medication
                          </Label>
                          <Input
                            id={`editMedicationName-${index}`}
                            value={entry.medication}
                            onChange={(event) =>
                              updateEditMedicationHistory(
                                index,
                                "medication",
                                event.target.value,
                              )
                            }
                            className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor={`editMedicationDosage-${index}`}>
                            Dosage
                          </Label>
                          <Input
                            id={`editMedicationDosage-${index}`}
                            value={entry.dosage}
                            onChange={(event) =>
                              updateEditMedicationHistory(
                                index,
                                "dosage",
                                event.target.value,
                              )
                            }
                            className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                          />
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor={`editMedicationStart-${index}`}>
                            Start date
                          </Label>
                          <Input
                            id={`editMedicationStart-${index}`}
                            type="date"
                            value={entry.startDate}
                            onChange={(event) =>
                              updateEditMedicationHistory(
                                index,
                                "startDate",
                                event.target.value,
                              )
                            }
                            className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor={`editMedicationEnd-${index}`}>
                            End date
                          </Label>
                          <Input
                            id={`editMedicationEnd-${index}`}
                            type="date"
                            value={entry.endDate}
                            onChange={(event) =>
                              updateEditMedicationHistory(
                                index,
                                "endDate",
                                event.target.value,
                              )
                            }
                            className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <input
                            id={`editMedicationOngoing-${index}`}
                            type="checkbox"
                            checked={entry.ongoing}
                            onChange={(event) =>
                              updateEditMedicationHistory(
                                index,
                                "ongoing",
                                event.target.checked,
                              )
                            }
                            className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <label
                            htmlFor={`editMedicationOngoing-${index}`}
                            className="text-sm text-zinc-600"
                          >
                            Ongoing
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`editMedicationNotes-${index}`}>
                          Notes
                        </Label>
                        <Textarea
                          id={`editMedicationNotes-${index}`}
                          value={entry.notes}
                          onChange={(event) =>
                            updateEditMedicationHistory(
                              index,
                              "notes",
                              event.target.value,
                            )
                          }
                          rows={3}
                          className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
                        />
                      </div>
                      {editForm.medicationHistories.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeEditMedicationHistory(index)}
                          className="text-xs font-medium text-rose-600 hover:text-rose-700"
                        >
                          Remove medication
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-2 justify-end">
                <Button
                  variant="outline"
                  className="rounded-xl border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  onClick={closeEditDialog}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-emerald-600 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-emerald-500 disabled:opacity-40"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving…" : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
