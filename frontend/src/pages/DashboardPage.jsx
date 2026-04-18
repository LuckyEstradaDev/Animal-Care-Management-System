import {Link} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  availablePets,
  reminderItems,
  screeningSteps,
  services,
} from "../data/mockData";
import {
  BellIcon,
  CalendarIcon,
  HeartIcon,
  ShieldIcon,
  SparklesIcon,
  StethoscopeIcon,
} from "../components/icons";

const stats = [
  {
    label: "Available pets",
    value: availablePets.length,
    note: "Ready to browse now",
    icon: HeartIcon,
  },
  {
    label: "Services",
    value: services.length,
    note: "Consultation and Pakapon",
    icon: CalendarIcon,
  },
  {
    label: "Reminders",
    value: reminderItems.length,
    note: "Vaccinations and follow-ups",
    icon: BellIcon,
  },
];

const shortcuts = [
  {
    title: "Online adoption",
    text: "Browse pets and submit an application.",
    to: "/adoption",
  },
  {
    title: "Register pet",
    text: "Submit a pet for admin review and future adoption.",
    to: "/register-pet",
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

export default function DashboardPage() {
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
              Guided flow
            </Badge>
            <CardTitle className="text-2xl">
              Simple entry points for the main user journeys
            </CardTitle>
            <CardDescription className="max-w-2xl">
              Each route stays focused on one task, so the interface feels
              lighter and easier to scan.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {shortcuts.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40"
              >
                <p className="font-medium text-slate-950">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Upcoming vaccinations, follow-ups, and appointment reminders.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reminderItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
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
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.detail}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Screening status</CardTitle>
              <CardDescription>
                Adoption applications begin as pending and update after review.
              </CardDescription>
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
                      <p className="text-sm font-medium text-slate-950">
                        {step.label}
                      </p>
                      <p className="text-xs text-slate-500">{step.date}</p>
                    </div>
                  </div>
                  <Badge
                    variant={step.status === "Complete" ? "primary" : "default"}
                  >
                    {step.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
