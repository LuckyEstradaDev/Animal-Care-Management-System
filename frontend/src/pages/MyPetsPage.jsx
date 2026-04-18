import { useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { PageHeader } from "../components/page-header";
import { petProfiles } from "../data/mockData";
import { StethoscopeIcon } from "../components/icons";

export default function MyPetsPage() {
  const [selectedPetId, setSelectedPetId] = useState(petProfiles[0].id);

  const selectedPet = useMemo(
    () => petProfiles.find((pet) => pet.id === selectedPetId) ?? petProfiles[0],
    [selectedPetId],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="2.4 Pet Health Digital Profile"
        title="Review vaccination records, medical history, and treatments"
        description="Select a pet to open the digital profile and track its care details in one place."
      />

      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <Card>
          <CardHeader>
            <CardTitle>My pets</CardTitle>
            <CardDescription>Choose a pet profile to inspect.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {petProfiles.map((pet) => {
              const active = pet.id === selectedPetId;
                return (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => setSelectedPetId(pet.id)}
                    className={`w-full rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 ${
                      active
                        ? "border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-950/10"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="h-14 w-14 rounded-2xl object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-semibold text-slate-950">{pet.name}</p>
                        <p className="text-sm text-slate-600">
                          {pet.species} | {pet.breed}
                        </p>
                      </div>
                      <Badge variant={active ? "primary" : "default"}>Open</Badge>
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
                      <StethoscopeIcon className="h-4 w-4" />
                    Next visit: {pet.nextVisit}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>{selectedPet.name}</CardTitle>
                  <CardDescription>
                    {selectedPet.species} · {selectedPet.breed}
                  </CardDescription>
                </div>
                <Badge variant="soft">Next visit {selectedPet.nextVisit}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Vaccinations</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{selectedPet.vaccinationRecords.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">History notes</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{selectedPet.medicalHistory.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Treatments</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{selectedPet.treatments.length}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Vaccination records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedPet.vaccinationRecords.map((record) => (
                  <div key={record.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-950">{record.label}</p>
                      <Badge variant={record.status === "Upcoming" ? "warning" : "primary"}>
                        {record.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{record.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical history</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedPet.medicalHistory.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
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
                {selectedPet.treatments.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
