import {useEffect, useMemo, useState} from "react";
import {Navigate} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card";
import {Dialog} from "../components/ui/dialog";
import {Input} from "../components/ui/input";
import {Label} from "../components/ui/label";
import {Select} from "../components/ui/select";
import {Textarea} from "../components/ui/textarea";
import {getAllPets} from "../services/petService";
import {createAdoption} from "../services/adoptionService";
import {useAuth} from "../context/AuthContext";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  homeType: "Apartment",
  householdSize: "2",
  hasChildren: "No",
  hasOtherPets: "No",
  experience: "First-time adopter",
  dailySchedule: "",
  reason: "",
  carePlan: "",
  financialPlan: "",
};

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "Today";
}

export default function AdoptionPage() {
  const {currentUser, isAuthenticated} = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePetId, setActivePetId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await getAllPets();
        const availablePets = (res.pets || []).filter(
          (pet) => pet.availability === "available",
        );
        setPets(availablePets);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load pets.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const activePet = useMemo(
    () => pets.find((pet) => pet._id === activePetId) || null,
    [activePetId, pets],
  );

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  function openModal(pet) {
    setActivePetId(pet._id);
    setForm({
      ...initialForm,
      fullName: currentUser?.name ?? "",
      email: currentUser?.email ?? "",
    });
    setSubmittedApplication(null);
    setError("");
  }

  function closeModal() {
    setActivePetId(null);
    setSubmittedApplication(null);
    setForm(initialForm);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentUser?.id || !activePet?._id) {
      setError("Missing user or pet information for this request.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await createAdoption({
        userId: currentUser.id,
        petId: activePet._id,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        homeType: form.homeType,
        householdSize: form.householdSize,
        hasChildren: form.hasChildren,
        hasOtherPets: form.hasOtherPets,
        experience: form.experience,
        dailySchedule: form.dailySchedule.trim(),
        reason: form.reason.trim(),
        carePlan: form.carePlan.trim(),
        financialPlan: form.financialPlan.trim(),
      });

      setSubmittedApplication(response.adoption ?? null);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit adoption request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available pets</CardTitle>
          <CardDescription>
            Open a profile to answer the screening form and submit a pending
            adoption request.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="text-sm text-slate-600">Loading pets...</p>
          ) : pets.length === 0 ? (
            <p className="text-sm text-slate-600">
              No pets are currently open for adoption.
            </p>
          ) : (
            pets.map((pet) => (
              <button
                key={pet._id}
                type="button"
                onClick={() => openModal(pet)}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-950/10"
              >
                <div className="relative h-44 bg-slate-100 sm:h-56">
                  <img
                    src={pet.imageUrl || "https://via.placeholder.com/300"}
                    alt={pet.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    Ready for screening
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-semibold text-slate-950">
                        {pet.name}
                      </h3>
                      <p className="break-words text-sm text-slate-600">
                        {pet.species} | {pet.breed}
                      </p>
                    </div>
                    <Badge className="shrink-0" variant="default">
                      {pet.age ? `${pet.age} yrs` : "N/A"}
                    </Badge>
                  </div>

                  <p className="break-words text-sm leading-6 text-slate-600">
                    Weight: {pet.weight || "N/A"} kg
                  </p>
                </div>
              </button>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(activePet)}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title={activePet ? `Apply for ${activePet.name}` : "Apply for adoption"}
        description="Answer the screening questions carefully. Requests are saved as pending review."
      >
        {activePet ? (
          submittedApplication ? (
            <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
              <div className="overflow-hidden rounded-3xl bg-slate-50">
                <img
                  src={activePet.imageUrl || "https://via.placeholder.com/300"}
                  alt={activePet.name}
                  className="h-56 w-full object-cover sm:h-full"
                />
              </div>

              <div className="space-y-4">
                <Badge variant="warning">Pending review</Badge>
                <h3 className="text-2xl font-semibold text-slate-950">
                  Adoption request submitted
                </h3>
                <p className="break-words text-sm text-slate-600">
                  Your request for {activePet.name} is now in the screening
                  queue. It will not be approved immediately.
                </p>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="break-words text-sm font-medium text-slate-950">
                    {submittedApplication._id}
                  </p>
                  <p className="text-sm text-slate-600">
                    Submitted {formatDate(submittedApplication.createdAt)}
                  </p>
                </div>

                <Button className="w-full" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-3xl bg-slate-100">
                  <img
                    src={activePet.imageUrl || "https://via.placeholder.com/300"}
                    alt={activePet.name}
                    className="h-56 w-full object-cover sm:h-72"
                  />
                </div>

                <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="break-words text-2xl font-semibold text-slate-950">
                    {activePet.name}
                  </h3>
                  <p className="break-words text-sm text-slate-600">
                    {activePet.species} | {activePet.breed}
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    Screening requests stay pending until reviewed.
                  </p>
                </div>
              </div>

              <div>
                {error ? (
                  <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full name</Label>
                      <Input
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) => setForm({...form, fullName: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => setForm({...form, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="homeType">Home type</Label>
                      <Select
                        id="homeType"
                        value={form.homeType}
                        onChange={(e) => setForm({...form, homeType: e.target.value})}
                      >
                        <option>Apartment</option>
                        <option>House</option>
                        <option>Condominium</option>
                        <option>Shared home</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="householdSize">People in household</Label>
                      <Select
                        id="householdSize"
                        value={form.householdSize}
                        onChange={(e) => setForm({...form, householdSize: e.target.value})}
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4+</option>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hasChildren">Children at home</Label>
                      <Select
                        id="hasChildren"
                        value={form.hasChildren}
                        onChange={(e) => setForm({...form, hasChildren: e.target.value})}
                      >
                        <option>No</option>
                        <option>Yes, under 10</option>
                        <option>Yes, 10 and above</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="hasOtherPets">Other pets at home</Label>
                      <Select
                        id="hasOtherPets"
                        value={form.hasOtherPets}
                        onChange={(e) => setForm({...form, hasOtherPets: e.target.value})}
                      >
                        <option>No</option>
                        <option>Yes, calm pets</option>
                        <option>Yes, energetic pets</option>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Pet care experience</Label>
                      <Select
                        id="experience"
                        value={form.experience}
                        onChange={(e) => setForm({...form, experience: e.target.value})}
                      >
                        <option>First-time adopter</option>
                        <option>Some experience</option>
                        <option>Experienced owner</option>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailySchedule">Daily schedule</Label>
                    <Textarea
                      id="dailySchedule"
                      value={form.dailySchedule}
                      onChange={(e) => setForm({...form, dailySchedule: e.target.value})}
                      placeholder="Describe who will be home, walk routines, and how long the pet may be left alone."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Why are you suitable for this pet?</Label>
                    <Textarea
                      id="reason"
                      value={form.reason}
                      onChange={(e) => setForm({...form, reason: e.target.value})}
                      placeholder="Explain why this pet fits your home, lifestyle, and expectations."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carePlan">Care plan</Label>
                    <Textarea
                      id="carePlan"
                      value={form.carePlan}
                      onChange={(e) => setForm({...form, carePlan: e.target.value})}
                      placeholder="Tell us about feeding, exercise, training, and veterinary care plans."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="financialPlan">Financial readiness</Label>
                    <Textarea
                      id="financialPlan"
                      value={form.financialPlan}
                      onChange={(e) => setForm({...form, financialPlan: e.target.value})}
                      placeholder="Share how you plan to cover food, vaccinations, grooming, and emergencies."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit application"}
                  </Button>
                </form>
              </div>
            </div>
          )
        ) : null}
      </Dialog>
    </div>
  );
}
