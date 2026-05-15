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
import {StethoscopeIcon} from "../components/icons";
import {useAuth} from "../context/AuthContext";
import {getPetsByOwner, updatePet} from "../services/petService";

const fallbackImage = "https://via.placeholder.com/320x220?text=Pet";

function createPetSummary(pet) {
  const notes = pet.description
    ? pet.description
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return {
    nextVisit: "No appointment yet",
    vaccinationRecords: [],
    medicalHistory:
      notes.length > 0 ? notes : ["No medical notes recorded yet."],
    treatments: pet.weight
      ? [`Current weight recorded at ${pet.weight} kg.`]
      : ["No treatment notes recorded yet."],
  };
}

export default function MyPetsPage() {
  const {currentUser, isAuthenticated} = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPetId, setEditingPetId] = useState(null);
  const [editReason, setEditReason] = useState("");
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

  async function openEditDialog(pet) {
    setEditingPetId(pet._id);
    setEditReason(pet.registrationReason || "personal_use");
  }

  function closeEditDialog() {
    setEditingPetId(null);
    setEditReason("");
  }

  async function handleSaveReason() {
    if (!editingPetId) return;

    try {
      setIsSaving(true);
      await updatePet(editingPetId, {registrationReason: editReason});
      setPets((current) =>
        current.map((pet) =>
          pet._id === editingPetId
            ? {...pet, registrationReason: editReason}
            : pet,
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
            return (
              <button
                key={pet._id}
                type="button"
                onClick={() => setSelectedPetId(pet._id)}
                className={`w-full rounded-2xl border p-3 text-left transition duration-150 hover:-translate-y-0.5 ${
                  active
                    ? "border-zinc-900 bg-zinc-900"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
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
                      className={`truncate text-xs mt-0.5 ${active ? "text-zinc-400" : "text-zinc-500"}`}
                    >
                      {pet.species} · {pet.breed || "Unknown breed"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-medium ${
                      active
                        ? "bg-white/10 text-zinc-300"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {pet.registrationReason === "adoption"
                      ? "Adoption"
                      : "Personal"}
                  </span>
                </div>
                <div
                  className={`mt-2.5 flex items-center gap-1.5 text-xs ${active ? "text-zinc-400" : "text-zinc-500"}`}
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
                <h2 className="text-lg font-semibold text-zinc-900">
                  {selectedPet.name}
                </h2>
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
              Edit reason
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
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl shadow-zinc-900/20">
            <button
              type="button"
              onClick={closeEditDialog}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-zinc-900">
              Edit registration reason
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Change why this pet is registered.
            </p>

            <div className="mt-5 flex flex-col gap-1.5">
              <label
                htmlFor="reasonSelect"
                className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
              >
                Registration reason
              </label>
              <Select
                id="reasonSelect"
                value={editReason}
                onChange={(event) => setEditReason(event.target.value)}
                className="w-full rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
              >
                <option value="personal_use">Personal use</option>
                <option value="adoption">For adoption</option>
                <option value="breeding">Breeding</option>
                <option value="rescue">Rescue</option>
              </Select>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                onClick={closeEditDialog}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl bg-zinc-900 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:opacity-40"
                onClick={handleSaveReason}
                disabled={isSaving}
              >
                {isSaving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
