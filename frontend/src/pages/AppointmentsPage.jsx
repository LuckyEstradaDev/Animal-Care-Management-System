import {useEffect, useMemo, useState} from "react";
import {Navigate} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {Input} from "../components/ui/input";
import {Label} from "../components/ui/label";
import {Select} from "../components/ui/select";
import {Textarea} from "../components/ui/textarea";
import {services} from "../data/mockData";
import {CalendarIcon} from "../components/icons";
import {useAuth} from "../context/AuthContext";
import {getPetsByOwner} from "../services/petService";
import {
  createAppointment,
  getAppointmentsByUser,
} from "../services/appoitnmentService";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function isFutureSchedule(date, time) {
  return new Date(`${date}T${time}`) > new Date();
}

const initialBooking = {
  petId: "",
  service: services[0],
  date: getToday(),
  time: "11:30",
  notes: "",
};

export default function AppointmentsPage() {
  const {currentUser, isAuthenticated} = useAuth();
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [booking, setBooking] = useState(initialBooking);
  const [confirmation, setConfirmation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!currentUser?.id) {
        setPets([]);
        setAppointments([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [petResponse, appointmentResponse] = await Promise.all([
          getPetsByOwner(currentUser.id),
          getAppointmentsByUser(currentUser.id),
        ]);

        const ownerPets = petResponse.pets ?? [];
        setPets(ownerPets.filter((pet) => pet.reviewStatus === "approved"));
        setAppointments(appointmentResponse.appointments ?? []);
        setBooking((current) => ({
          ...current,
          petId: current.petId || ownerPets[0]?._id || "",
        }));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load appointments page data.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [currentUser?.id]);

  const selectedPet = useMemo(
    () => pets.find((pet) => pet._id === booking.petId) ?? null,
    [pets, booking.petId],
  );

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentUser?.id) {
      setError("No signed-in user was found for this session.");
      return;
    }

    if (!booking.petId) {
      setError("Please register a pet before booking an appointment.");
      return;
    }

    if (!isFutureSchedule(booking.date, booking.time)) {
      setError(
        "Please choose an appointment date and time that has not passed yet.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await createAppointment({
        userId: currentUser.id,
        petId: booking.petId,
        service: booking.service,
        appointmentDate: booking.date,
        appointmentTime: booking.time,
        notes: booking.notes.trim(),
      });

      const savedAppointment = response.appointment ?? null;
      if (savedAppointment) {
        setConfirmation(savedAppointment);
        setAppointments((current) => [savedAppointment, ...current]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create appointment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Appointments
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Book a visit and track your pet's appointment history.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        {/* ── Booking form ── */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-zinc-900">
              Book appointment
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Choose your pet, service, date, and time.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="rounded-xl bg-zinc-50 p-5 text-sm text-zinc-400">
              Loading your pets and appointments…
            </div>
          ) : pets.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
              Register a pet first so you can book an appointment for it.
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="pet"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Pet
                </Label>
                <Select
                  id="pet"
                  value={booking.petId}
                  onChange={(event) =>
                    setBooking({...booking, petId: event.target.value})
                  }
                  className="w-full rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
                >
                  {pets.map((pet) => (
                    <option key={pet._id} value={pet._id}>
                      {pet.name} ({pet.species})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="service"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Service
                </Label>
                <Select
                  id="service"
                  value={booking.service}
                  onChange={(event) =>
                    setBooking({...booking, service: event.target.value})
                  }
                  className="w-full rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
                >
                  {services.map((service) => (
                    <option key={service}>{service}</option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="date"
                    className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                  >
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    min={getToday()}
                    value={booking.date}
                    onChange={(event) =>
                      setBooking({...booking, date: event.target.value})
                    }
                    required
                    className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-0"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="time"
                    className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                  >
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={booking.time}
                    onChange={(event) =>
                      setBooking({...booking, time: event.target.value})
                    }
                    required
                    className="rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="notes"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={booking.notes}
                  onChange={(event) =>
                    setBooking({...booking, notes: event.target.value})
                  }
                  placeholder="Anything the clinic should know before your visit?"
                  className="min-h-[80px] resize-y rounded-xl border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-900 focus:ring-0"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CalendarIcon className="h-4 w-4" />
                {isSubmitting ? "Saving appointment…" : "Book appointment"}
              </Button>
            </form>
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="flex flex-col gap-5">
          {/* Confirmation */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-zinc-900">
                Confirmation
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                The booking summary appears here after submission.
              </p>
            </div>

            {confirmation ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">
                      {selectedPet?.name || "Selected pet"}
                    </p>
                    <p className="mt-0.5 text-sm text-emerald-700">
                      {confirmation.service}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    {confirmation.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    {label: "Date", value: confirmation.appointmentDate},
                    {label: "Time", value: confirmation.appointmentTime},
                    {label: "Status", value: confirmation.status},
                  ].map(({label, value}) => (
                    <div key={label} className="rounded-xl bg-white p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-zinc-900">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-zinc-50 p-5">
                <p className="text-sm font-medium text-zinc-700">
                  No booking yet.
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Submit the form to generate a booking confirmation card.
                </p>
              </div>
            )}
          </div>

          {/* Recent appointments */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">
                  Recent appointments
                </h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Saved bookings for the signed-in user.
                </p>
              </div>
              {appointments.length > 0 && (
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500">
                  {appointments.length}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {appointments.length > 0 ? (
                appointments.map((appointment) => {
                  const pet = pets.find(
                    (item) => item._id === appointment.petId,
                  );
                  return (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3.5 transition hover:border-zinc-200 hover:bg-white"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-zinc-900">
                          {appointment.service}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-zinc-500">
                          {pet?.name || "Unknown pet"} ·{" "}
                          {appointment.appointmentDate} at{" "}
                          {appointment.appointmentTime}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600">
                        {appointment.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl bg-zinc-50 p-5 text-sm text-zinc-400">
                  Your appointment history will appear here after your first
                  booking.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
