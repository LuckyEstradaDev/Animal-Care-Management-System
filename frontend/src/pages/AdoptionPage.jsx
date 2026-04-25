import {useEffect, useMemo, useState} from "react";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card";
import {Dialog} from "../components/ui/dialog";
import {Input} from "../components/ui/input";
import {Label} from "../components/ui/label";
import {Select} from "../components/ui/select";
import {Textarea} from "../components/ui/textarea";
import {getAllPets} from "../services/petService";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  homeType: "Apartment",
  experience: "First-time adopter",
  message: "",
};

export default function AdoptionPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePetId, setActivePetId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submittedApplication, setSubmittedApplication] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await getAllPets();
        setPets(res.pets || []);
      } catch (error) {
        console.error("FETCH ERROR:", error);
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

  function openModal(pet) {
    setActivePetId(pet._id);
    setForm(initialForm);
    setSubmittedApplication(null);
  }

  function closeModal() {
    setActivePetId(null);
    setSubmittedApplication(null);
    setForm(initialForm);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmittedApplication({
      id: `APP-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      pet: activePet?.name || "Selected pet",
      status: "Pending review",
      submittedAt: "Today",
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available pets</CardTitle>
          <CardDescription>
            Tap a card to open the application modal.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="text-sm text-slate-600">Loading pets...</p>
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
                    {pet.availability}
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
        description="Review the pet details and submit your application in one place."
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
                <Badge variant="primary">{submittedApplication.status}</Badge>
                <h3 className="text-2xl font-semibold text-slate-950">
                  Application submitted
                </h3>
                <p className="break-words text-sm text-slate-600">
                  Your application for {submittedApplication.pet} has been
                  received.
                </p>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="break-words text-sm font-medium text-slate-950">
                    {submittedApplication.id}
                  </p>
                  <p className="text-sm text-slate-600">
                    Submitted {submittedApplication.submittedAt}
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
                </div>
              </div>

              <div>
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
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                      placeholder="Tell us why you'd be a great fit."
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit application
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
