import {useEffect, useMemo, useState} from "react";
import {Navigate} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card";
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
  size: "Medium",
  temperament: "Calm",
  description: "",
  reason: "",
  photoUrl: "",
};

export default function PetRegistrationPage() {
  const {currentUser, isAuthenticated} = useAuth();
  const [form, setForm] = useState(initialForm);
  const [registeredPets, setRegisteredPets] = useState([]);
  const [submitted, setSubmitted] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const mySubmissions = useMemo(() => registeredPets, [registeredPets]);

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
        description: [form.description.trim(), form.reason.trim()]
          .filter(Boolean)
          .join("\n\n"),
        imageUrl: form.photoUrl.trim(),
        availability: "not available",
        owner: currentUser.id,
      });

      if (response.pet) {
        setSubmitted(response.pet);
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
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Pet registration form</CardTitle>
            <CardDescription>
              {currentUser?.role === "pet_owner"
                ? "Your account is marked as a pet owner."
                : "This page is open to logged-in users, but it is designed for pet owners."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-950">
                  Registering as {currentUser?.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  This pet will automatically be linked to {currentUser?.email}.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="petName">Pet name</Label>
                  <Input
                    id="petName"
                    value={form.petName}
                    onChange={(event) => setForm({...form, petName: event.target.value})}
                    placeholder="Coco"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={form.breed}
                    onChange={(event) => setForm({...form, breed: event.target.value})}
                    placeholder="Mixed Breed"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="species">Species</Label>
                  <Select
                    id="species"
                    value={form.species}
                    onChange={(event) => setForm({...form, species: event.target.value})}
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
                    value={form.age}
                    onChange={(event) => setForm({...form, age: event.target.value})}
                    placeholder="2"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select
                    id="size"
                    value={form.size}
                    onChange={(event) => setForm({...form, size: event.target.value})}
                  >
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="temperament">Temperament</Label>
                  <Select
                    id="temperament"
                    value={form.temperament}
                    onChange={(event) => setForm({...form, temperament: event.target.value})}
                  >
                    <option>Calm</option>
                    <option>Playful</option>
                    <option>Gentle</option>
                    <option>Active</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photoFile">Pet photo</Label>
                  <Input
                    id="photoFile"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoPick}
                  />
                  <p className="text-xs text-slate-500">
                    Pick an image and we&apos;ll attach it to this pet profile.
                  </p>
                </div>
              </div>

              {form.photoUrl ? (
                <div className="space-y-2">
                  <Label>Photo preview</Label>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img
                      src={form.photoUrl}
                      alt="Pet preview"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="description">Pet description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) => setForm({...form, description: event.target.value})}
                  placeholder="Tell us about the pet's personality, habits, and care needs."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Why is the pet being registered?</Label>
                <Textarea
                  id="reason"
                  value={form.reason}
                  onChange={(event) => setForm({...form, reason: event.target.value})}
                  placeholder="Explain the reason for the adoption listing."
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving pet..." : "Submit pet"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review status</CardTitle>
              <CardDescription>
                Newly registered pets are saved to your account right away.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-emerald-900">
                        {submitted.name}
                      </p>
                      <p className="break-words text-sm text-emerald-800">
                        {submitted.species} | {submitted.breed || "Unknown breed"}
                      </p>
                    </div>
                    <Badge className="self-start sm:self-auto" variant="primary">
                      Saved
                    </Badge>
                  </div>
                  <p className="mt-4 break-words text-sm leading-6 text-emerald-900/90">
                    This pet is now tied to your account and will appear in My
                    Pets and on the appointment page.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="font-medium text-slate-950">No submission yet.</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Once submitted, this panel will show the latest saved pet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your submissions</CardTitle>
              <CardDescription>
                These entries are loaded from the backend for the signed-in user.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Loading your pets...
                </div>
              ) : mySubmissions.length > 0 ? (
                mySubmissions.map((item) => (
                  <div key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="break-words font-medium text-slate-950">
                          {item.name}
                        </p>
                        <p className="break-words text-sm text-slate-600">
                          {item.species} | {item.breed || "Unknown breed"}
                        </p>
                      </div>
                      <Badge className="self-start sm:self-auto" variant="soft">
                        {item.availability ?? "not available"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                      Registered {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "recently"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Your submissions will appear here after you register a pet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
