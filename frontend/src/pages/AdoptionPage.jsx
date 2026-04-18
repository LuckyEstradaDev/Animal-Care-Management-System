import { useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { PageHeader } from "../components/page-header";
import { availablePets } from "../data/mockData";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  homeType: "Apartment",
  experience: "First-time adopter",
  message: "",
};

export default function AdoptionPage() {
  const [activePetId, setActivePetId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submittedApplication, setSubmittedApplication] = useState(null);

  const activePet = useMemo(
    () => availablePets.find((pet) => pet.id === activePetId) ?? null,
    [activePetId],
  );

  function openModal(pet) {
    setActivePetId(pet.id);
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
      pet: activePet?.name ?? "Selected pet",
      status: "Pending review",
      submittedAt: "Today",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="2.2 Online Adoption"
        title="Browse pets and apply in a simple modal"
        description="Click any pet card to open the application form. The page stays clean while the modal handles the details."
      />

      <Card>
        <CardHeader>
          <CardTitle>Available pets</CardTitle>
          <CardDescription>Click a card to open the application modal.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {availablePets.map((pet) => (
            <button
              key={pet.id}
              type="button"
              onClick={() => openModal(pet)}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-950/10"
            >
              <div className="relative h-56 bg-slate-100">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute left-4 top-4 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {pet.status}
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{pet.name}</h3>
                    <p className="text-sm text-slate-600">
                      {pet.species} | {pet.breed}
                    </p>
                  </div>
                  <Badge variant="default">{pet.energy}</Badge>
                </div>
                <p className="text-sm leading-6 text-slate-600">{pet.description}</p>
              </div>
            </button>
          ))}
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
                <img src={activePet.imageUrl} alt={activePet.name} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-4">
                <Badge variant="primary">{submittedApplication.status}</Badge>
                <h3 className="text-2xl font-semibold text-slate-950">Application submitted</h3>
                <p className="text-sm leading-6 text-slate-600">
                  Your application for {submittedApplication.pet} has been received and is waiting for admin review.
                </p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-950">{submittedApplication.id}</p>
                  <p className="text-sm text-slate-600">Submitted {submittedApplication.submittedAt}</p>
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
                  <img src={activePet.imageUrl} alt={activePet.name} className="h-72 w-full object-cover" />
                </div>
                <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-950">{activePet.name}</h3>
                      <p className="text-sm text-slate-600">
                        {activePet.species} | {activePet.breed}
                      </p>
                    </div>
                    <Badge variant="default">{activePet.energy}</Badge>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{activePet.idealHome}</p>
                  <div className="flex flex-wrap gap-2">
                    {activePet.compatibility.map((item) => (
                      <Badge key={item} variant="default">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full name</Label>
                      <Input
                        id="fullName"
                        value={form.fullName}
                        onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                        placeholder="Jane Tan"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(event) => setForm({ ...form, phone: event.target.value })}
                        placeholder="+65 9123 4567"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      placeholder="jane@example.com"
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="homeType">Home type</Label>
                      <Select
                        id="homeType"
                        value={form.homeType}
                        onChange={(event) => setForm({ ...form, homeType: event.target.value })}
                      >
                        <option>Apartment</option>
                        <option>House</option>
                        <option>Condominium</option>
                        <option>Farm or open space</option>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Select
                        id="experience"
                        value={form.experience}
                        onChange={(event) => setForm({ ...form, experience: event.target.value })}
                      >
                        <option>First-time adopter</option>
                        <option>Some experience</option>
                        <option>Experienced owner</option>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Why do you want to adopt {activePet.name}?</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(event) => setForm({ ...form, message: event.target.value })}
                      placeholder="Tell us about your home, routine, and the companion you are looking for."
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      Submit application
                    </Button>
                    <Button type="button" variant="outline" className="border-slate-200 bg-white" onClick={closeModal}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )
        ) : null}
      </Dialog>
    </div>
  );
}
