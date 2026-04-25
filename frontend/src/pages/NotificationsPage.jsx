import {useState} from "react";
import {Badge} from "../components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card";
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
              Notifications for vaccinations, follow-ups, and appointment reminders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminderItems.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="shrink-0 rounded-2xl bg-emerald-50 p-2 text-emerald-700">
                      <BellIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="break-words font-medium text-slate-950">
                        {item.title}
                      </p>
                      <p className="break-words text-sm text-slate-500">
                        Automated reminder
                      </p>
                    </div>
                  </div>
                  <Badge
                    className="self-start sm:self-auto"
                    variant={item.tone === "warning" ? "warning" : "primary"}
                  >
                    {item.tone}
                  </Badge>
                </div>
                <p className="mt-3 break-words text-sm leading-6 text-slate-600">
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
                className="flex w-full items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100"
              >
                <span className="min-w-0 break-words text-sm font-medium text-slate-950">
                  {label}
                </span>
                <span
                  className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${
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
