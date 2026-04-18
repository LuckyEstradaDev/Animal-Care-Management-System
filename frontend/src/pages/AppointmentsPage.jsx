import {useState} from "react";
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

const initialBooking = {
  service: services[0],
  date: "2026-04-21",
  time: "11:30",
  notes: "",
};

export default function AppointmentsPage() {
  const [booking, setBooking] = useState(initialBooking);
  const [confirmation, setConfirmation] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    setConfirmation({
      number: `APT-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      ...booking,
      status: "Confirmed",
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Book appointment</CardTitle>
            <CardDescription>
              Choose the service, date, and time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Select
                  id="service"
                  value={booking.service}
                  onChange={(event) =>
                    setBooking({...booking, service: event.target.value})
                  }
                >
                  {services.map((service) => (
                    <option key={service}>{service}</option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={booking.date}
                    onChange={(event) =>
                      setBooking({...booking, date: event.target.value})
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={booking.time}
                    onChange={(event) =>
                      setBooking({...booking, time: event.target.value})
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={booking.notes}
                  onChange={(event) =>
                    setBooking({...booking, notes: event.target.value})
                  }
                  placeholder="Anything the clinic should know before your visit?"
                />
              </div>

              <Button type="submit" className="w-full">
                <CalendarIcon className="h-4 w-4" />
                Book Appointment
              </Button>
            </form>
          </CardContent>
        </Card>

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
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-emerald-900">
                      {confirmation.number}
                    </p>
                    <p className="text-sm text-emerald-800">
                      {confirmation.service}
                    </p>
                  </div>
                  <Badge variant="primary">{confirmation.status}</Badge>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Date
                    </p>
                    <p className="mt-1 font-semibold text-slate-950">
                      {confirmation.date}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Time
                    </p>
                    <p className="mt-1 font-semibold text-slate-950">
                      {confirmation.time}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Status
                    </p>
                    <p className="mt-1 font-semibold text-slate-950">
                      Awaiting confirmation
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
      </div>
    </div>
  );
}
