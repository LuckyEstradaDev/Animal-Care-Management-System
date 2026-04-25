import {useEffect, useMemo, useState} from "react";
import {Navigate} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {useAuth} from "../context/AuthContext";
import {getPetsByOwner} from "../services/petService";

const fallbackImage = "https://via.placeholder.com/320x220?text=Pet";

function formatDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString();
}

export default function MyPetsPage() {
  const {currentUser, isAuthenticated} = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPets() {
      if (!currentUser?.id) {
        setPets([]);
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

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Loading your pets...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!selectedPet) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-lg font-semibold text-slate-950">No pets yet</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Register a pet first and it will show up here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <Card>
          <CardHeader>
            <CardTitle>My pets</CardTitle>
            <CardDescription>
              Select one of your saved pets to review its profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pets.map((pet) => {
              const active = pet._id === selectedPet._id;
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
                  <div className="flex items-center gap-3">
                    <img
                      src={pet.imageUrl || fallbackImage}
                      alt={pet.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-semibold text-slate-950">
                        {pet.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {pet.species}
                        {pet.breed ? ` | ${pet.breed}` : ""}
                      </p>
                    </div>
                    <Badge variant={active ? "primary" : "default"}>
                      {pet.availability ?? "saved"}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="min-h-[280px] bg-slate-100">
                <img
                  src={selectedPet.imageUrl || fallbackImage}
                  alt={selectedPet.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>{selectedPet.name}</CardTitle>
                      <CardDescription>
                        {selectedPet.species}
                        {selectedPet.breed ? ` | ${selectedPet.breed}` : ""}
                      </CardDescription>
                    </div>
                    <Badge variant="soft">
                      {selectedPet.availability ?? "saved"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Age
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {selectedPet.age ?? "N/A"}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Weight
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {selectedPet.weight ? `${selectedPet.weight} kg` : "N/A"}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Registered
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {formatDate(selectedPet.createdAt)}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Owner
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {currentUser?.name}
                    </p>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Care notes</CardTitle>
              <CardDescription>
                Profile notes saved during registration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">
                {selectedPet.description?.trim() ||
                  "No extra care notes were added for this pet yet."}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
