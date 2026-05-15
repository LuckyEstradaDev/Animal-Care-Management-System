import {useEffect, useMemo, useState} from "react";
import {Navigate} from "react-router-dom";
import {getAllPets} from "../services/petService";
import {createAdoption} from "../services/adoptionService";
import {useAuth} from "../context/AuthContext";
import {Dialog} from "../components/ui/dialog";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  homeType: "Apartment",
  householdSize: "2",
  hasChildren: "No",
  hasOtherPets: "No",
  experience: "First-time adopter",
  dailySchedule: "",
  reason: "",
  carePlan: "",
  financialPlan: "",
};

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "Today";
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-950/5 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15";

const labelCls =
  "block text-[11px] font-semibold uppercase tracking-widest text-slate-500";

function Field({id, label, children}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AdoptionPage() {
  const {currentUser, isAuthenticated} = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePetId, setActivePetId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await getAllPets();
        const adoptionPets = (res.pets || []).filter(
          (pet) =>
            pet.registrationReason === "adoption" &&
            pet.owner !== currentUser.id &&
            pet.reviewStatus === "approved",
        );
        console.log(res.pets);
        setPets(adoptionPets);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load pets.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const activePet = useMemo(
    () => pets.find((pet) => pet._id === activePetId) || null,
    [activePetId, pets],
  );

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  function openModal(pet) {
    setActivePetId(pet._id);
    setForm({
      ...initialForm,
      fullName: currentUser?.name ?? "",
      email: currentUser?.email ?? "",
    });
    setSubmittedApplication(null);
    setError("");
  }

  function closeModal() {
    setActivePetId(null);
    setSubmittedApplication(null);
    setForm(initialForm);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentUser?.id || !activePet?._id) {
      setError("Missing user or pet information for this request.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await createAdoption({
        userId: currentUser.id,
        petId: activePet._id,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        homeType: form.homeType,
        householdSize: form.householdSize,
        hasChildren: form.hasChildren,
        hasOtherPets: form.hasOtherPets,
        experience: form.experience,
        dailySchedule: form.dailySchedule.trim(),
        reason: form.reason.trim(),
        carePlan: form.carePlan.trim(),
        financialPlan: form.financialPlan.trim(),
      });

      setSubmittedApplication(response.adoption ?? null);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit adoption request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Find a companion
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Browse pets open for adoption and submit a screening application.
        </p>
      </div>

      {/* ── Pet grid ── */}
      {loading ? (
        <p className="text-sm text-zinc-400">Loading pets…</p>
      ) : pets.length === 0 ? (
        <p className="text-sm text-zinc-400">
          No pets are currently open for adoption.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => (
            <button
              key={pet._id}
              type="button"
              onClick={() => openModal(pet)}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left transition duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/10"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-zinc-100">
                <img
                  src={pet.imageUrl || "https://via.placeholder.com/300"}
                  alt={pet.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-3 top-3 rounded-full bg-zinc-900/70 px-3 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm">
                  Open for adoption
                </span>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-zinc-900">
                      {pet.name}
                    </h3>
                    <p className="mt-0.5 truncate text-sm text-zinc-500">
                      {pet.species} · {pet.breed}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                    {pet.age ? `${pet.age} yr` : "N/A"}
                  </span>
                </div>
                <p className="mt-3 inline-block rounded-lg bg-zinc-50 px-2.5 py-1 text-xs text-zinc-500">
                  {pet.weight ? `${pet.weight} kg` : "Weight N/A"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      <Dialog
        open={Boolean(activePet)}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title={activePet ? `Apply for ${activePet.name}` : "Apply for adoption"}
        description="Answer the screening questions carefully. Requests are saved as pending review."
        contentClassName="max-w-5xl"
        bodyClassName="bg-slate-50/70"
      >
        {activePet ? (
          submittedApplication ? (
            /* ── SUCCESS STATE ── */
            <div className="grid overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-64 overflow-hidden bg-emerald-50">
                <img
                  src={activePet.imageUrl || "https://via.placeholder.com/300"}
                  alt={activePet.name}
                  className="h-full min-h-64 w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent p-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-emerald-100">
                    Adoption request
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">
                    {activePet.name}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-5 p-5 sm:p-6">
                <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-700">
                  Pending review
                </span>

                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    Application submitted
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Your request for{" "}
                    <span className="font-medium text-slate-800">
                      {activePet.name}
                    </span>{" "}
                    is now in the screening queue. We'll reach out via email
                    once a decision is made.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Reference ID
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-950">
                    {submittedApplication._id}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Submitted {formatDate(submittedApplication.createdAt)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* ── FORM STATE ── */
            <div className="grid gap-5 md:grid-cols-[0.85fr_1.15fr]">
              {/* Left — pet snapshot */}
              <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50">
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={
                      activePet.imageUrl || "https://via.placeholder.com/300"
                    }
                    alt={activePet.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-700 shadow-sm backdrop-blur">
                    Ready to adopt
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-slate-950">
                    {activePet.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {activePet.species} · {activePet.breed}
                  </p>
                  <div className="my-4 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-white/80 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        Age
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {activePet.age ? `${activePet.age} yr` : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/80 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        Weight
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {activePet.weight ? `${activePet.weight} kg` : "N/A"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Applications remain pending until manually reviewed. We'll
                    contact you once a decision is reached.
                  </p>
                </div>
              </div>

              {/* Right — form */}
              <div>
                {error && (
                  <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <form
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 sm:p-5"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-slate-950">
                      Screening details
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Share the basics so the team can review your application.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field id="fullName" label="Full name">
                      <input
                        id="fullName"
                        className={inputCls}
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({...form, fullName: e.target.value})
                        }
                        required
                      />
                    </Field>
                    <Field id="phone" label="Phone">
                      <input
                        id="phone"
                        className={inputCls}
                        value={form.phone}
                        onChange={(e) =>
                          setForm({...form, phone: e.target.value})
                        }
                        required
                      />
                    </Field>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Field id="email" label="Email">
                      <input
                        id="email"
                        type="email"
                        className={inputCls}
                        value={form.email}
                        onChange={(e) =>
                          setForm({...form, email: e.target.value})
                        }
                        required
                      />
                    </Field>
                    <Field id="homeType" label="Home type">
                      <select
                        id="homeType"
                        className={inputCls}
                        value={form.homeType}
                        onChange={(e) =>
                          setForm({...form, homeType: e.target.value})
                        }
                      >
                        <option>Apartment</option>
                        <option>House</option>
                        <option>Condominium</option>
                        <option>Shared home</option>
                      </select>
                    </Field>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Field id="householdSize" label="People in household">
                      <select
                        id="householdSize"
                        className={inputCls}
                        value={form.householdSize}
                        onChange={(e) =>
                          setForm({...form, householdSize: e.target.value})
                        }
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4+</option>
                      </select>
                    </Field>
                    <Field id="hasChildren" label="Children at home">
                      <select
                        id="hasChildren"
                        className={inputCls}
                        value={form.hasChildren}
                        onChange={(e) =>
                          setForm({...form, hasChildren: e.target.value})
                        }
                      >
                        <option>No</option>
                        <option>Yes, under 10</option>
                        <option>Yes, 10 and above</option>
                      </select>
                    </Field>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Field id="hasOtherPets" label="Other pets at home">
                      <select
                        id="hasOtherPets"
                        className={inputCls}
                        value={form.hasOtherPets}
                        onChange={(e) =>
                          setForm({...form, hasOtherPets: e.target.value})
                        }
                      >
                        <option>No</option>
                        <option>Yes, calm pets</option>
                        <option>Yes, energetic pets</option>
                      </select>
                    </Field>
                    <Field id="experience" label="Pet care experience">
                      <select
                        id="experience"
                        className={inputCls}
                        value={form.experience}
                        onChange={(e) =>
                          setForm({...form, experience: e.target.value})
                        }
                      >
                        <option>First-time adopter</option>
                        <option>Some experience</option>
                        <option>Experienced owner</option>
                      </select>
                    </Field>
                  </div>

                  <div className="mt-4 space-y-4">
                  <Field id="dailySchedule" label="Daily schedule">
                    <textarea
                      id="dailySchedule"
                      className={`${inputCls} min-h-[76px] resize-y`}
                      value={form.dailySchedule}
                      onChange={(e) =>
                        setForm({...form, dailySchedule: e.target.value})
                      }
                      placeholder="Who will be home, walk routines, and how long the pet may be left alone."
                      required
                    />
                  </Field>

                  <Field id="reason" label="Why are you suitable for this pet?">
                    <textarea
                      id="reason"
                      className={`${inputCls} min-h-[76px] resize-y`}
                      value={form.reason}
                      onChange={(e) =>
                        setForm({...form, reason: e.target.value})
                      }
                      placeholder="Explain why this pet fits your home, lifestyle, and expectations."
                      required
                    />
                  </Field>

                  <Field id="carePlan" label="Care plan">
                    <textarea
                      id="carePlan"
                      className={`${inputCls} min-h-[76px] resize-y`}
                      value={form.carePlan}
                      onChange={(e) =>
                        setForm({...form, carePlan: e.target.value})
                      }
                      placeholder="Feeding, exercise, training, and veterinary care plans."
                      required
                    />
                  </Field>

                  <Field id="financialPlan" label="Financial readiness">
                    <textarea
                      id="financialPlan"
                      className={`${inputCls} min-h-[76px] resize-y`}
                      value={form.financialPlan}
                      onChange={(e) =>
                        setForm({...form, financialPlan: e.target.value})
                      }
                      placeholder="How you plan to cover food, vaccinations, grooming, and emergencies."
                      required
                    />
                  </Field>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-5 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/15 transition hover:-translate-y-0.5 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting ? "Submitting…" : "Submit application"}
                  </button>
                </form>
              </div>
            </div>
          )
        ) : null}
      </Dialog>
    </div>
  );
}
