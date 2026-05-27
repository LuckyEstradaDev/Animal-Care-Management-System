import {useMemo, useState, useEffect} from "react";
import AdoptionDetailsModal from "../modal/AdoptionDetailsModal";
import {getAllAdoptions} from "../services/adoptionService";

/* MOCK DATA */
const mockAdoptions = [
  {
    _id: "6801a1f0c9a1b23d10000001",
    fullName: "John Carter",
    email: "johncarter@gmail.com",
    phone: "09171234567",
    status: "pending_review",
  },

  {
    _id: "6801a1f0c9a1b23d10000002",
    fullName: "Maria Santos",
    email: "mariasantos@gmail.com",
    phone: "09987654321",
    status: "approved",
  },

  {
    _id: "6801a1f0c9a1b23d10000003",
    fullName: "Kevin Lee",
    email: "kevinlee@gmail.com",
    phone: "09175554444",
    status: "rejected",
  },

  {
    _id: "6801a1f0c9a1b23d10000004",
    fullName: "Sophia Reyes",
    email: "sophiareyes@gmail.com",
    phone: "09221112222",
    status: "pending_review",
  },

  {
    _id: "6801a1f0c9a1b23d10000005",
    fullName: "Daniel Cruz",
    email: "danielcruz@gmail.com",
    phone: "09334445555",
    status: "approved",
  },
];

const AdminAdoption = () => {
  const [adoption, setAdoption] = useState([]);

  const [selectedPet, setSelectedPet] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchAdoptions = async () => {
      const data = await getAllAdoptions();
      console.log("Fetched Adoptions:", data.adoptions);
      setAdoption(data.adoptions || []); // Use fetched data or fallback to empty array
    };

    fetchAdoptions();
  }, []);

  const filteredAdoptions = useMemo(() => {
    let result = adoption;

    if (filter === "all") {
      result = adoption;
    } else {
      result = adoption.filter((item) => item.status === filter);
    }

    if (searchTerm) {
      result = result.filter((item) =>
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return result;
  }, [adoption, filter, searchTerm]);

  const viewDetails = (item) => {
    setSelectedPet(item);
    setShowDetails(true);
  };

  const handleStatus = (id, status) => {
    setAdoption((prev) =>
      prev.map((item) => (item._id === id ? {...item, status} : item)),
    );
  };

  return (
    <section className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_26%),linear-gradient(180deg,#f8fafc_0%,#eefaf4_100%)] p-6">
      {/* MODAL */}
      {showDetails && (
        <AdoptionDetailsModal
          selectedPet={selectedPet}
          onClose={() => setShowDetails(false)}
        />
      )}

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Adoption Applications
          </h1>

          <p className="text-sm text-gray-600">
            Review and approve adoption requests
          </p>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer
            ${
              filter === "all"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("pending_review")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer
            ${
              filter === "pending_review"
                ? "bg-yellow-500 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer
            ${
              filter === "approved"
                ? "bg-green-500 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Approved
          </button>

          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer
            ${
              filter === "rejected"
                ? "bg-red-500 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Rejected
          </button>

          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white px-4 rounded-xl text-slate-700 placeholder:text-slate-500 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredAdoptions.length === 0 && (
        <div className="bg-slate-100 h-40 w-full rounded-xl flex items-center justify-center text-slate-500">
          No Adoption Requests Found
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAdoptions.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="p-5 space-y-3">
              {/* NAME */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.fullName}
                </h2>

                <p className="text-sm text-gray-500">{item.email}</p>

                <p className="text-sm text-gray-500">{item.phone}</p>
              </div>

              {/* STATUS */}
              <span
                className={`inline-block px-3 py-1 text-xs rounded-full font-medium capitalize
                ${
                  item.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : item.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status.replace("_", " ")}
              </span>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-3">
                <button
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300"
                  onClick={() => viewDetails(item)}
                >
                  More Details
                </button>

                {item.status === "pending_review" && (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300"
                      onClick={() => handleStatus(item._id, "approved")}
                    >
                      ✓
                    </button>

                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300"
                      onClick={() => handleStatus(item._id, "rejected")}
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminAdoption;
