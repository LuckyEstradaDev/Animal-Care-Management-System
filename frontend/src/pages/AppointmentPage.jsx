import {
  availablePets,
  reminderItems,
  screeningSteps,
  services,
} from "../data/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {Link} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {useEffect, useState} from "react";

import {
  getAllAppointments,
  deleteAppointment,
} from "../services/appoitnmentService";

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);

  const DeleteAppointment = async (id) => {
    const isConfirm = confirm("Are you sure to delete this appointment");
    if (!isConfirm) return;

    try {
      const res = await deleteAppointment(id);
      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await getAllAppointments();
      setAppointments(res.appointments);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <section className="bg-transparent h-screen w-full">
      <div className="space-y-6">
        <div className="justify-between items-end flex">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-gray-900">
              Pet Appointments Table
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              Upcoming vaccinations, follow-ups, and appointment reminders.
            </p>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-5 bg-slate-100 p-3 rounded-t-xl font-semibold text-sm">
          <div className="text-gray-800">Service</div>
          <div className="text-gray-800">Date</div>
          <div className="text-gray-800">Time</div>
          <div className="text-gray-800">Notes</div>
          <div className="text-gray-800 text-right">Actions</div>
        </div>

        {/* TABLE BODY */}
        <div className="divide-y">
          {appointments.length === 0 && (
            <div className="bg-slate-100 h-100 w-full justify-center items-center flex rounded-xl text-slate-500">
              No Appointment Available
            </div>
          )}
          {appointments.map((item, index) => (
            <div
              key={item._id}
              className="grid grid-cols-5 items-center p-3 bg-white hover:bg-slate-50"
            >
              {/* SERVICE */}
              <div className="font-medium text-gray-800">{item.service}</div>

              {/* DATE */}
              <div className="text-sm text-slate-600">
                {item.appointmentDate}
              </div>

              {/* TIME */}
              <div className="text-sm text-slate-600">
                {item.appointmentTime}
              </div>

              {/* NOTES */}
              <div className="text-sm text-slate-600">{item.notes || "—"}</div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2">
                <button
                  className="bg-red-500 h-10 w-10 text-white text-xs font-semibold rounded-full cursor-pointer hover:bg-red-600"
                  onClick={() => DeleteAppointment(item._id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default AppointmentPage;
