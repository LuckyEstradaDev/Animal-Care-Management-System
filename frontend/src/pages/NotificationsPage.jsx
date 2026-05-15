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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your reminders and delivery preferences.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* ── Upcoming notifications ── */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Upcoming notifications
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                Vaccinations, follow-ups, and appointment reminders.
              </p>
            </div>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500">
              {reminderItems.length}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {reminderItems.map((item) => (
              <div
                key={item.title}
                className="flex items-start justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition hover:border-zinc-200 hover:bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-500 shadow-sm">
                    <BellIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      Automated reminder
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                      {item.detail}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    item.tone === "warning"
                      ? "border border-amber-200 bg-amber-50 text-amber-700"
                      : "bg-zinc-900 text-white"
                  }`}
                >
                  {item.tone}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Preferences ── */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-zinc-900">
              Notification preferences
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Control how reminder updates are delivered.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {[
              [
                "vaccinations",
                "Upcoming vaccinations",
                "Get notified before scheduled vaccines.",
              ],
              [
                "followUps",
                "Follow-up checkups",
                "Reminders for post-visit follow-ups.",
              ],
              [
                "appointmentReminders",
                "Appointment reminders",
                "Alerts before upcoming appointments.",
              ],
              [
                "email",
                "Email updates",
                "Receive all notifications via email.",
              ],
            ].map(([key, label, description]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3.5 text-left transition hover:border-zinc-200 hover:bg-white"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900">{label}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">{description}</p>
                </div>
                <span
                  className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${
                    preferences[key] ? "bg-zinc-900" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      preferences[key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
