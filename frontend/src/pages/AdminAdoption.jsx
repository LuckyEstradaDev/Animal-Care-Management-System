import { useEffect, useState } from "react";
import { getAllAdoptions, deleteAdoption } from "../services/adoptionService";
import AdoptionDetailsModal from "../modal/AdoptionDetailsModal";

const AdminAdoption = () => {
  const [adoption, setAdoption] = useState([]);

  const [selectedPet, setSelectedPet] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const deleteAdoption = async (id) => {
    const isConfirm = confirm("Are you sure to delete this pet on adoption list?");
    if(!isConfirm) return;
    
       try {
         const res = await deleteAdoption(id)
         fetchAdoption();
       } catch (error) {
        console.log(error)
       }
  }

  const viewDetails = (item) => {
    // console.log(item);
    setShowDetails(true);
    setSelectedPet(item);
  }

  const fetchAdoption = async () => {
    try {
      const res = await getAllAdoptions();
      setAdoption(res.adoptions || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdoption();
  }, []);

  return (
    <section className="min-h-screen w-full bg-slate-900 p-6">
      {showDetails && (
        <AdoptionDetailsModal selectedPet={selectedPet}
                              onClose={() => setShowDetails(false)}
        />
      )}

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">
          Pets for Adoption
        </h1>
        <p className="text-sm text-slate-300">
          Manage all pets currently in adoption process
        </p>
      </div>

      {/* EMPTY STATE */}
      {adoption.length === 0 && (
        <div className="bg-slate-950 h-40 w-full rounded-xl flex items-center justify-center text-slate-500">
          No Pets Available for Adoption
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {adoption.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >

            <div className="p-4 space-y-2">

              {/* PET NAME */}
              <h2 className="text-lg font-semibold text-gray-800">
                {item.fullName || "Unknown Pet"}
              </h2>

              {/* PET DETAILS */}
              <p className="text-sm text-gray-600">
                {item.email} • {item.phone}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block px-3 py-1 text-xs rounded-full
                ${
                  item.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : item.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status}
              </span>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-3">

                <button className="flex-1 bg-white hover:text-blue-500 text-gray-300 py-2 rounded-lg text-sm cursor-pointer"
                onClick={() => viewDetails(item)}>
                  More Details
                </button>

                <button className="flex-1 bg-gray-200 hover:bg-red-600 text-white py-2 rounded-lg text-sm cursor-pointer"
                onClick={() => deleteAdoption(item._id)}>
                  Delete
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default AdminAdoption;