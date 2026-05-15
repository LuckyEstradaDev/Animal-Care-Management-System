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
import {ComboBox} from "@/components/ui/combo-box";

const initialForm = {
  petName: "",
  species: "Dog",
  breed: "",
  age: "",
  size: "Medium",
  temperament: "Calm",
  description: "",
  registrationReason: "personal_use",
  photoUrl: "",
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
        description: form.description.trim(),
        imageUrl: form.photoUrl.trim(),
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

        {/* Species, Age, Size */}
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

        {/* Registration reason */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reason"
            className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
          >
            Registration reason
          </label>
          <Select
            id="species"
            value={form.reason}
            onChange={(event) => setForm({...form, reason: event.target.value})}
            className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:ring-0 transition"
          >
            <option value="adoption">For Adoption</option>
            <option value="personal_use">For Personal Use</option>
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
