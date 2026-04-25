import {availablePets} from "../data/mockData";
import {Badge} from "../components/ui/badge";
import {BellIcon, CalendarIcon, ShieldIcon} from "../components/icons";

const About_Page = () => {
  const highlights = [
    {
      title: "Screened adoption flow",
      text: "Collect meaningful household, care, and readiness details before a request moves forward.",
      icon: ShieldIcon,
    },
    {
      title: "Care scheduling",
      text: "Let users book appointments for their pets and keep upcoming visits visible in one place.",
      icon: CalendarIcon,
    },
    {
      title: "Personal reminders",
      text: "Keep pet owners aware of follow-ups, care milestones, and screening progress.",
      icon: BellIcon,
    },
  ];

  return (
    <section id="about" className="bg-white px-4 py-14 sm:py-20 md:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="max-w-2xl">
            <Badge variant="soft" className="w-fit">
              Why PawCare
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              A calmer, clearer adoption experience for people and pets.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              PawCare keeps adoption requests, health information, and owner
              activity connected so users can move through the process with more
              confidence and less guesswork.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {availablePets.slice(0, 3).map((pet) => (
              <div key={pet.id} className="overflow-hidden rounded-[28px] bg-slate-100">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-[32px] bg-slate-950 px-6 py-8 text-white sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Built for the user side
              </p>
              <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">
                From discovery to screening, users can handle the full adoption journey in one place.
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                Browse available pets with real profile images.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                Submit a screened request instead of instant adoption.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                Manage appointments and registered pets after sign-in.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About_Page;
