import {useState} from "react";
import {Badge} from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {reminderItems} from "../data/mockData";
import {BellIcon} from "../components/icons";

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState({
    vaccinations: true,
    followUps: true,
    appointmentReminders: true,
    email: true,
    sms: false,
  });

  function toggle(key) {
    setPreferences({...preferences, [key]: !preferences[key]});
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming notifications</CardTitle>
            <CardDescription>
              Notifications for vaccinations, follow-ups, and appointment
              reminders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminderItems.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700">
                      <BellIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-950">{item.title}</p>
                      <p className="text-sm text-slate-500">
                        Automated reminder
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={item.tone === "warning" ? "warning" : "primary"}
                  >
                    {item.tone}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.detail}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification preferences</CardTitle>
            <CardDescription>
              Control how reminder updates are delivered.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["vaccinations", "Upcoming vaccinations"],
              ["followUps", "Follow-up checkups"],
              ["appointmentReminders", "Appointment reminders"],
              ["email", "Email updates"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100"
              >
                <span className="text-sm font-medium text-slate-950">
                  {label}
                </span>
                <span
                  className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
                    preferences[key] ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white transition ${
                      preferences[key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
