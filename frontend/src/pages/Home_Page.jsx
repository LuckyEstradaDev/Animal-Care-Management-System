import {Link} from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import {availablePets} from "../data/mockData";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {HeartIcon, ShieldIcon, SparklesIcon} from "../components/icons";

const Home_Page = () => {
  const featuredPets = availablePets.slice(0, 2);

  return (
    <>
      <NavigationBar />
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_22%),linear-gradient(180deg,#f8fafc_0%,#eefaf4_100%)] px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6">
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 pt-6 sm:pt-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl">
              <Badge variant="soft" className="border border-emerald-200 bg-emerald-50 text-emerald-800">
                PawCare User Portal
              </Badge>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.02] text-emerald-950 sm:text-5xl lg:text-6xl">
                Responsible adoption starts with better care records.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Explore adoptable pets, submit screened adoption requests, and
                manage appointments and pet records in one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="rounded-full px-6">
                  <Link to="/auth?mode=register">Create account</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-emerald-200 bg-white px-6 text-emerald-800 hover:bg-emerald-50"
                >
                  <Link to="/auth?mode=login">Sign in</Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <SparklesIcon className="h-5 w-5 text-emerald-300" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">
                    Guided adoption
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Screening-first requests instead of instant approval.
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <ShieldIcon className="h-5 w-5 text-emerald-500" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">
                    Secure accounts
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Backend-connected login and protected user sessions.
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <HeartIcon className="h-5 w-5 text-emerald-500" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">
                    Pet-centered care
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Appointments, pet registration, and my-pets tracking.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {featuredPets.map((pet, index) => (
                <div
                  key={pet.id}
                  className={`overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-lg shadow-emerald-950/5 ${
                    index === 0 ? "sm:translate-y-4" : ""
                  }`}
                >
                  <div className="flex h-64 items-center justify-center bg-slate-50 p-4 sm:h-72">
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="h-full w-full rounded-2xl object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="text-sm font-semibold text-slate-950">{pet.name}</p>
                    <p className="text-sm text-slate-600">
                      {pet.species} | {pet.breed}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 text-sm text-emerald-800">
            <div className="h-px flex-1 bg-emerald-200" />
            <span>Adoption, screening, and care in one system</span>
            <div className="h-px flex-1 bg-emerald-200" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home_Page;
