import {useEffect, useMemo, useState} from "react";
import {Navigate} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card";
import {Input} from "../components/ui/input";
import {Label} from "../components/ui/label";
import {Select} from "../components/ui/select";
import {Textarea} from "../components/ui/textarea";
import {services} from "../data/mockData";
import {CalendarIcon} from "../components/icons";
import {useAuth} from "../context/AuthContext";
import {getPetsByOwner} from "../services/petService";
import {createAppointment, getAppointmentsByUser} from "../services/appoitnmentService";

function getToday() {
  return new Date().toISOString().split("T")[0];
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
        setPets(ownerPets);
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
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Book appointment</CardTitle>
            <CardDescription>
              Choose your pet, service, date, and time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                Loading your pets and appointments...
              </div>
            ) : pets.length === 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                Register a pet first so you can book an appointment for it.
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="pet">Pet</Label>
                  <Select
                    id="pet"
                    value={booking.petId}
                    onChange={(event) => setBooking({...booking, petId: event.target.value})}
                  >
                    {pets.map((pet) => (
                      <option key={pet._id} value={pet._id}>
                        {pet.name} ({pet.species})
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Select
                    id="service"
                    value={booking.service}
                    onChange={(event) => setBooking({...booking, service: event.target.value})}
                  >
                    {services.map((service) => (
                      <option key={service}>{service}</option>
                    ))}
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      min={getToday()}
                      value={booking.date}
                      onChange={(event) => setBooking({...booking, date: event.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={booking.time}
                      onChange={(event) => setBooking({...booking, time: event.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={booking.notes}
                    onChange={(event) => setBooking({...booking, notes: event.target.value})}
                    placeholder="Anything the clinic should know before your visit?"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <CalendarIcon className="h-4 w-4" />
                  {isSubmitting ? "Saving appointment..." : "Book Appointment"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Confirmation</CardTitle>
              <CardDescription>
                The booking summary appears here after submission.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {confirmation ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-emerald-900">
                        {selectedPet?.name || "Selected pet"}
                      </p>
                      <p className="break-words text-sm text-emerald-800">
                        {confirmation.service}
                      </p>
                    </div>
                    <Badge className="self-start sm:self-auto" variant="primary">
                      {confirmation.status}
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Date
                      </p>
                      <p className="mt-1 break-words font-semibold text-slate-950">
                        {confirmation.appointmentDate}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Time
                      </p>
                      <p className="mt-1 break-words font-semibold text-slate-950">
                        {confirmation.appointmentTime}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 sm:col-span-2 lg:col-span-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Status
                      </p>
                      <p className="mt-1 break-words font-semibold text-slate-950">
                        {confirmation.status}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="font-medium text-slate-950">No booking yet.</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Submit the form to generate a booking confirmation card.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent appointments</CardTitle>
              <CardDescription>
                Saved bookings for the signed-in user.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.length > 0 ? (
                appointments.map((appointment) => {
                  const pet = pets.find((item) => item._id === appointment.petId);

                  return (
                    <div key={appointment._id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="break-words font-medium text-slate-950">
                            {appointment.service}
                          </p>
                          <p className="break-words text-sm text-slate-600">
                            {pet?.name || "Unknown pet"}
                          </p>
                        </div>
                        <Badge className="self-start sm:self-auto" variant="soft">
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {appointment.appointmentDate} at {appointment.appointmentTime}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Your appointment history will appear here after your first booking.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
