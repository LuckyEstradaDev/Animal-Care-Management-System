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
    label: "Total Pets",
    value: availablePets.length,
    note: "Ready to browse now",
    icon: HeartIcon,
  },
  {
    label: "Adopted Pets",
    value: services.length,
    note: "Consultation and Pakapon",
    icon: CalendarIcon,
  },
  {
    label: "Total Users",
    value: reminderItems.length,
    note: "Vaccinations and follow-ups",
    icon: BellIcon,
  },
  {
    label: "Appointments Today",
    value: availablePets.length,
    note: "Ready to browse now",
    icon: HeartIcon,
  },
  {
    label: "Pending Appointments",
    value: services.length,
    note: "Consultation and Pakapon",
    icon: CalendarIcon,
  },
  {
    label: "Match Success Rate",
    value: "99%",
    note: "Vaccinations and follow-ups",
    icon: BellIcon,
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
            <CardTitle className="text-2xl">
              Pets Ready for Adoption 🐾
            </CardTitle>
            <CardDescription className="max-w-2xl">
              Browse pets that are currently available and waiting for a new
              home.
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
                    <p className="font-medium text-slate-950">{pet.name}</p>

                    <p className="text-sm text-slate-600">{pet.breed}</p>
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

      <Card>
    <div className="justify-between items-end flex p-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">Pet Appointments Table</h1>
          <p className="text-sm leading-6 text-slate-600">
            Upcoming vaccinations, follow-ups, and appointment reminders.
          </p>
      </div>
    </div>

    <CardContent>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-4 bg-slate-100 p-3 rounded-t-xl font-semibold text-sm">
        <div className="text-gray-800">Title</div>
        <div className="text-gray-800">Detail</div>
        <div className="text-gray-800">Status</div>
        <div className="text-gray-800 text-right">Actions</div>
      </div>

      {/* TABLE BODY */}
      <div className="divide-y">
        {reminderItems.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-4 items-center p-3 bg-white hover:bg-slate-50"
          >
            {/* TITLE */}
            <div className="font-medium text-gray-800">{item.title}</div>

            {/* DETAIL */}
            <div className="text-sm text-slate-600">{item.detail}</div>

            {/* STATUS */}
            <div>
              <Badge
                variant={
                  item.tone === "primary"
                    ? "default"
                    : item.tone === "warning"
                    ? "secondary"
                    : "outline"
                }
              >
                {item.tone}
              </Badge>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Tipaklong')}
              >
                Edit
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => alert('Tipaklong')}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
              <CardTitle>Pets List</CardTitle>
              <CardDescription>
                Adoption applications begin as pending and update after review.
              </CardDescription>
    </CardHeader>
    <div className="h-50 w-full mb-4 grid grid-cols-4 overflow-y-scroll gap-4 p-2">
         {availablePets.map((pet) => (
          <div key={pet.id} className="flex-1 bg-white border-2 border-gray-300 rounded-2xl p-2 cursor-pointer hover:-translate-y-1">
            <div className="w-full justify-start items-center flex border-b-2 border-b-gray-300 gap-2 pb-2">
                <img src={pet.imageUrl} className="h-10 w-10 rounded-full object-cover"/>
                <h1 className="text-md font-semibold text-gray-800">{pet.name}</h1>
                <h1 className="text-sm text-gray-500">| {pet.age}</h1>
            </div>
            <div className="h-full w-full justify-start items-start flex gap-2 p-2">
                <ul>
                  <li className="text-md text-gray-800">➤ Species: {pet.species}</li>
                  <li className="text-md text-gray-800">➤ Breed: {pet.breed}</li>
                  <li className="text-md text-gray-800">➤ Size: {pet.size}</li>
                </ul>
            </div>

          </div>
         ))}
    </div>
  </Card>
    </div>
  );
}
