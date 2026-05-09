import {useEffect, useMemo, useState} from "react";
import {Navigate} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card";
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
    medicalHistory: notes.length > 0 ? notes : ["No medical notes recorded yet."],
    treatments: pet.weight ? [`Current weight recorded at ${pet.weight} kg.`] : ["No treatment notes recorded yet."],
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
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <Card>
          <CardHeader>
            <CardTitle>My pets</CardTitle>
            <CardDescription>Choose a pet profile to inspect.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pets.map((pet) => {
              const active = pet._id === selectedPet._id;
              const petDetails = createPetSummary(pet);

              return (
                <button
                  key={pet._id}
                  type="button"
                  onClick={() => setSelectedPetId(pet._id)}
                  className={`w-full rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 ${
                    active
                      ? "border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-950/10"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <img
                      src={pet.imageUrl || fallbackImage}
                      alt={pet.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-lg font-semibold text-slate-950">
                        {pet.name}
                      </p>
                      <p className="break-words text-sm text-slate-600">
                        {pet.species} | {pet.breed || "Unknown breed"}
                      </p>
                    </div>
                    <Badge className="self-start sm:self-auto" variant={active ? "primary" : "default"}>
                      {pet.registrationReason === "adoption" ? "For adoption" : "Personal"}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
                    <StethoscopeIcon className="h-4 w-4" />
                    <span className="break-words">Next visit: {petDetails.nextVisit}</span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <CardTitle className="break-words">{selectedPet.name}</CardTitle>
                  <CardDescription className="break-words">
                    {selectedPet.species} | {selectedPet.breed || "Unknown breed"}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2 self-start sm:self-auto">
                  <Badge className="self-start sm:self-auto" variant="soft">
                    Next visit {details.nextVisit}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(selectedPet)}
                    className="self-start sm:self-auto"
                  >
                    Edit reason
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Vaccinations
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {details.vaccinationRecords.length}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  History notes
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {details.medicalHistory.length}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Treatments
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {details.treatments.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Vaccination records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {details.vaccinationRecords.length > 0 ? (
                  details.vaccinationRecords.map((record) => (
                    <div
                      key={record.label}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="break-words font-medium text-slate-950">
                          {record.label}
                        </p>
                        <Badge
                          className="self-start sm:self-auto"
                          variant={record.status === "Upcoming" ? "warning" : "primary"}
                        >
                          {record.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{record.date}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    No vaccination records available yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical history</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {details.medicalHistory.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Treatments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {details.treatments.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog
        open={Boolean(editingPetId)}
        onOpenChange={(open) => {
          if (!open) closeEditDialog();
        }}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={closeEditDialog}
              className="absolute right-4 top-4 text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-slate-950">Edit registration reason</h2>
            <p className="mt-2 text-sm text-slate-600">
              Change why this pet is registered.
            </p>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reasonSelect">Registration reason</Label>
                <Select
                  id="reasonSelect"
                  value={editReason}
                  onChange={(event) => setEditReason(event.target.value)}
                >
                  <option value="personal_use">Personal use</option>
                  <option value="adoption">For adoption</option>
                  <option value="breeding">Breeding</option>
                  <option value="rescue">Rescue</option>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeEditDialog}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSaveReason}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
