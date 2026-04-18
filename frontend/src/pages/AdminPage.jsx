import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { availablePets, reminderItems, screeningSteps, services } from "../data/mockData";
import { BellIcon, CalendarIcon, HeartIcon, ShieldIcon, SparklesIcon, StethoscopeIcon } from "../components/icons";

const stats = [
  { label: "Total Pets", value: availablePets.length, note: "Ready to browse now", icon: HeartIcon },
  { label: "Adopted Pets", value: services.length, note: "Consultation and Pakapon", icon: CalendarIcon },
  { label: "Total Users", value: reminderItems.length, note: "Vaccinations and follow-ups", icon: BellIcon },
  { label: "Appointments Today", value: availablePets.length, note: "Ready to browse now", icon: HeartIcon },
  { label: "Pending Appointments", value: services.length, note: "Consultation and Pakapon", icon: CalendarIcon },
  { label: "Match Success Rate", value: "99%", note: "Vaccinations and follow-ups", icon: BellIcon },
];

const shortcuts = [
  {
    title: "Online adoption",
    text: "Browse pets and submit an application.",
    to: "/adoption",
  },
  {
    title: "AI matching",
    text: "Answer a short questionnaire for recommendations.",
    to: "/matching",
  },
  {
    title: "Appointments",
    text: "Pick a service and reserve a time.",
    to: "/appointments",
  },
  {
    title: "My pets",
    text: "Open health records and treatment notes.",
    to: "/my-pets",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="overflow-hidden">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="mt-2 text-3xl">{stat.value}</CardTitle>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
            <CardHeader>
                <Badge variant="soft" className="w-fit">
                Available Pets for Adoption
                </Badge>
                <CardTitle className="text-2xl">Pets Ready for Adoption 🐾</CardTitle>
                <CardDescription className="max-w-2xl">
                Browse pets that are currently available and waiting for a new home.
                </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3 sm:grid-cols-1">
                {availablePets.length === 0 ? (
                <p className="text-slate-500">No pets available right now.</p>
                ) : (
                availablePets.map((pet) => (
                    <div
                    key={pet._id}
                    className="rounded-2xl border justify-between items-start flex border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                    >
                        <div className="flex flex-col gap-2">
                            <p className="font-medium text-slate-950">
                                {pet.name}
                            </p>

                            <p className="text-sm text-slate-600">
                                 {pet.breed}
                            </p>
                        </div>
                    
                        <div>
                            <div className="mt-1 text-sm text-emerald-700 bg-green-100 rounded-full px-3">
                                {pet.age}
                            </div>
                        </div>

                    </div>
                ))
                )}
            </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments Today</CardTitle>
              <CardDescription>Upcoming vaccinations, follow-ups, and appointment reminders.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reminderItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-950">{item.title}</p>
                    <Badge
                      variant={
                        item.tone === "primary"
                          ? "primary"
                          : item.tone === "warning"
                            ? "warning"
                            : "default"
                      }
                    >
                      {item.tone}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Screening status</CardTitle>
              <CardDescription>Adoption applications begin as pending and update after review.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {screeningSteps.slice(0, 3).map((step, index) => (
                <div
                  key={step.label}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-950">{step.label}</p>
                      <p className="text-xs text-slate-500">{step.date}</p>
                    </div>
                  </div>
                  <Badge variant={step.status === "Complete" ? "primary" : "default"}>{step.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button variant="soft" className="border-0">
              <ShieldIcon className="h-4 w-4" />
              Review status
            </Button>
            <Button variant="outline" className="border-slate-200 bg-white">
              <StethoscopeIcon className="h-4 w-4" />
              Open health profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

