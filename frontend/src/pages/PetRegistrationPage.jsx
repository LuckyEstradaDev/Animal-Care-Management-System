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
import {Input} from "../components/ui/input";
import {Label} from "../components/ui/label";
import {Select} from "../components/ui/select";
import {Textarea} from "../components/ui/textarea";
import {useAuth} from "../context/AuthContext";
import {createPet, getPetsByOwner} from "../services/petService";

const initialForm = {
  name: "",
  species: "Dog",
  breed: "",
  age: "",
  weight: "",
  description: "",
  imageUrl: "",
};

export default function PetRegistrationPage() {
  const {currentUser, isAuthenticated} = useAuth();
  const [form, setForm] = useState(initialForm);
  const [pets, setPets] = useState([]);
  const [submittedPet, setSubmittedPet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const [error, setError] = useState("");

  const hasPets = useMemo(() => pets.length > 0, [pets]);

  useEffect(() => {
    async function loadPets() {
      if (!currentUser?.id) {
        setPets([]);
        setIsLoadingPets(false);
        return;
      }

      try {
        setIsLoadingPets(true);
        const response = await getPetsByOwner(currentUser.id);
        setPets(response.pets ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load your pets.",
        );
      } finally {
        setIsLoadingPets(false);
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
        name: form.name.trim(),
        species: form.species,
        breed: form.breed.trim(),
        age: form.age ? Number(form.age) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        availability: "not available",
        owner: currentUser.id,
      });

      const nextPet = response.pet ?? null;
      if (nextPet) {
        setSubmittedPet(nextPet);
        setPets((current) => [nextPet, ...current]);
      }
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register pet.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Register your pet</CardTitle>
            <CardDescription>
              Save your pet to your account so it appears in My Pets and can be
              selected for appointments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner name</Label>
                  <Input
                    id="ownerName"
                    value={currentUser?.name ?? ""}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Owner email</Label>
                  <Input
                    id="ownerEmail"
                    value={currentUser?.email ?? ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Pet name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(event) =>
                      setForm({...form, name: event.target.value})
                    }
                    placeholder="Coco"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={form.breed}
                    onChange={(event) =>
                      setForm({...form, breed: event.target.value})
                    }
                    placeholder="Mixed Breed"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="species">Species</Label>
                  <Select
                    id="species"
                    value={form.species}
                    onChange={(event) =>
                      setForm({...form, species: event.target.value})
                    }
                  >
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Rabbit</option>
                    <option>Bird</option>
                    <option>Other</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    step="1"
                    value={form.age}
                    onChange={(event) =>
                      setForm({...form, age: event.target.value})
                    }
                    placeholder="2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Photo URL</Label>
                <Input
                  id="imageUrl"
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm({...form, imageUrl: event.target.value})
                  }
                  placeholder="Optional image link"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Care notes</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) =>
                    setForm({...form, description: event.target.value})
                  }
                  placeholder="Add anything useful about temperament, routines, or care needs."
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving pet..." : "Register pet"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest registration</CardTitle>
              <CardDescription>
                Your newest saved pet will appear here right away.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {submittedPet ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-emerald-900">
                        {submittedPet.name}
                      </p>
                      <p className="text-sm text-emerald-800">
                        {submittedPet.species}
                        {submittedPet.breed ? ` | ${submittedPet.breed}` : ""}
                      </p>
                    </div>
                    <Badge variant="primary">Saved</Badge>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-emerald-900/90">
                    This pet is now linked to your account and available in My
                    Pets and the appointment booking page.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="font-medium text-slate-950">No recent save yet.</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Submit the form to create your first pet profile.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your registered pets</CardTitle>
              <CardDescription>
                These records are loaded from the backend by your user id.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoadingPets ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Loading your pets...
                </div>
              ) : hasPets ? (
                pets.map((pet) => (
                  <div
                    key={pet._id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950">{pet.name}</p>
                        <p className="text-sm text-slate-600">
                          {pet.species}
                          {pet.breed ? ` | ${pet.breed}` : ""}
                        </p>
                      </div>
                      <Badge variant="soft">
                        {pet.availability ?? "not available"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Your pets will appear here after you register them.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
