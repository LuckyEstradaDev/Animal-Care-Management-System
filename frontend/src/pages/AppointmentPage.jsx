import { useEffect, useState } from "react";
import {
  getAllAppointments,
  deleteAppointment,
  updateAppointment,
} from "../services/appoitnmentService";

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // ✅ MOCK DATA (fallback)
  const mockAppointments = [
    {
      _id: "apt_001",
      userId: "user_101",
      petId: "pet_201",
      service: "Vaccination",
      appointmentDate: "2026-05-18",
      appointmentTime: "10:00 AM",
      notes: "Bring vaccination record",
      status: "pending",
    },
    {
      _id: "apt_002",
      userId: "user_102",
      petId: "pet_202",
      service: "General Checkup",
      appointmentDate: "2026-05-20",
      appointmentTime: "2:00 PM",
      notes: "Pet has been coughing recently",
      status: "confirmed",
    },
    {
      _id: "apt_003",
      userId: "user_103",
      petId: "pet_203",
      service: "Grooming",
      appointmentDate: "2026-05-22",
      appointmentTime: "11:30 AM",
      notes: "Full grooming + nail trimming",
      status: "pending",
    },
    {
      _id: "apt_004",
      userId: "user_104",
      petId: "pet_204",
      service: "Deworming",
      appointmentDate: "2026-05-25",
      appointmentTime: "9:00 AM",
      notes: "",
      status: "confirmed",
    },
    {
      _id: "apt_005",
      userId: "user_105",
      petId: "pet_205",
      service: "Surgery Consultation",
      appointmentDate: "2026-05-28",
      appointmentTime: "3:30 PM",
      notes: "Possible leg injury evaluation",
      status: "rejected",
    },
  ];

  // ✅ LOAD DATA
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getAllAppointments();
      setAppointments(res.appointments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ FILTER
  const filteredAppointments = appointments.filter((item) => {
    if (filter === "all") return true;
    if (filter === "pending") return item.status === "pending";
    if (filter === "approved") return item.status === "confirmed";
    if (filter === "rejected") return item.status === "rejected";
  });

  // ✅ CHANGE STATUS (REAL FUNCTION)
  const changeStatus = async (id, status) => {
    try {
      await updateAppointment(id, { status });

      setAppointments((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ❌ DELETE
  const deleteHandler = async (id) => {
    const ok = confirm("Delete this appointment?");
    if (!ok) return;

    try {
      await deleteAppointment(id);

      setAppointments((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 🎨 STATUS BADGE
  const StatusBadge = ({ status }) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";

    if (status === "pending") {
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700`}>
          Pending
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className={`${base} bg-red-100 text-red-700`}>
          Rejected
        </span>
      );
    }

    return (
      <span className={`${base} bg-green-100 text-green-700`}>
        Approved
      </span>
    );
  };

  return (
    <section className="h-screen w-full p-4">
      <div className="space-y-4">

        {/* HEADER */}
        <div className="flex justify-between items-start">

          <div>
            <h1 className="text-lg font-semibold">
              Appointment Management
            </h1>
            <p className="text-sm text-slate-600">
              Manage appointment approvals
            </p>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex gap-2">

            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === "all"
                  ? "bg-slate-800 text-white"
                  : "bg-white border"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-white border"
              }`}
            >
              Pending
            </button>

            <button
              onClick={() => setFilter("approved")}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-white border"
              }`}
            >
              Approved
            </button>

            <button
              onClick={() => setFilter("rejected")}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-white border"
              }`}
            >
              Rejected
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="space-y-2">

          {filteredAppointments.length === 0 && (
            <div className="p-6 text-center text-slate-500">
              No appointments found
            </div>
          )}

          {filteredAppointments.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-7 bg-white p-3 rounded-lg hover:bg-slate-50"
            >

              <div>{item.service}</div>
              <div>{item.appointmentDate}</div>
              <div>{item.appointmentTime}</div>
              <div className="text-xs">{item.petId}</div>

              <div>
                <StatusBadge status={item.status} />
              </div>

              <div className="text-sm text-slate-600">
                {item.notes || "—"}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2">

                {item.status === "pending" && (
                  <>
                    <button
                      onClick={() => changeStatus(item._id, "confirmed")}
                      className="h-10 w-10 text-xs bg-green-600 text-white rounded-xl hover:bg-green-700"
                    >
                      ✓
                    </button>

                    <button
                      onClick={() => changeStatus(item._id, "rejected")}
                      className="h-10 w-10 text-xs bg-red-600 text-white rounded-xl hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </>
                )}

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AppointmentPage;