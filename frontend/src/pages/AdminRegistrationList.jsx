import { useEffect, useState } from "react";
import {
  getAllPets,
  deletePet,
  updatePet,
} from "../services/petService";
import ViewPetsRegistrationModal from "../modal/ViewPetsRegistrationModal";

const AdminPetRegistrationList = () => {

  // ✅ MOCK DATA
  const mockPets = [
    {
      _id: "pet_001",
      name: "Luna",
      species: "Dog",
      breed: "Golden Retriever",
      age: 3,
      weight: 28,
      temperament: "Friendly and playful",
      description:
        "Luna is a very active dog who loves outdoor walks and playing fetch.",
      imageUrl: "https://placehold.co/200x200",
      medicalHistories: [],
      medicationHistories: [],
      vaccinationRecords: [],
      registrationReason: "personal_use",
      reviewStatus: "in_review",
      owner: "user_101",
    },
    {
      _id: "pet_002",
      name: "Milo",
      species: "Cat",
      breed: "Persian",
      age: 2,
      weight: 5,
      temperament: "Calm and affectionate",
      description: "Milo enjoys sleeping most of the day.",
      imageUrl: "https://placehold.co/200x200",
      medicalHistories: [],
      medicationHistories: [],
      vaccinationRecords: [],
      registrationReason: "adoption",
      reviewStatus: "in_review",
      owner: "user_102",
    },
    {
      _id: "pet_003",
      name: "Rocky",
      species: "Dog",
      breed: "Bulldog",
      age: 5,
      weight: 22,
      temperament: "Stubborn but loyal",
      description: "Rocky has a strong personality.",
      imageUrl: "https://placehold.co/200x200",
      medicalHistories: [],
      medicationHistories: [],
      vaccinationRecords: [],
      registrationReason: "rescue",
      reviewStatus: "approved",
      owner: "user_103",
    },
    {
      _id: "pet_004",
      name: "Bella",
      species: "Dog",
      breed: "Shih Tzu",
      age: 4,
      weight: 7,
      temperament: "Gentle and social",
      description: "Bella is very friendly and loves kids.",
      imageUrl: "https://placehold.co/200x200",
      medicalHistories: [],
      medicationHistories: [],
      vaccinationRecords: [],
      registrationReason: "personal_use",
      reviewStatus: "rejected",
      owner: "user_104",
    },
  ];

  // STATES
  const [pets, setPets] = useState(mockPets);
  const [filter, setFilter] = useState("in_review");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showViewPetModal, setShowViewPetModal] = useState(false);

  const ViewModal = (pet) => {
        setSelectedPet(pet);
        setShowViewPetModal(true);
  }

  // LOAD DATA (API fallback ready)
  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await getAllPets();
      setPets(res.pets);
    } catch (err) {
      console.log("Using mock data");
      setPets(mockPets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // FILTER + SEARCH
  const filteredPets = pets.filter((pet) => {
    const matchesStatus =
      filter === "all" ? true : pet.reviewStatus === filter;

    const matchesSearch =
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.species.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(search.toLowerCase()) ||
      pet.owner.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // UPDATE STATUS
  const changeStatus = async (id, reviewStatus) => {
    try {
      await updatePet(id, { reviewStatus });

      setPets((prev) =>
        prev.map((pet) =>
          pet._id === id ? { ...pet, reviewStatus } : pet
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const deleteHandler = async (id) => {
    const ok = confirm("Delete this pet registration?");
    if (!ok) return;

    try {
      await deletePet(id);

      setPets((prev) => prev.filter((pet) => pet._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // STATUS BADGE
  const StatusBadge = ({ status }) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";

    if (status === "in_review") {
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700`}>
          In Review
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
    <>
    {showViewPetModal && (<ViewPetsRegistrationModal pet={selectedPet} onClose={() => setShowViewPetModal(false)}/>)}
    <section className="h-screen w-full p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Pet Registration Requests
        </h1>
        <p className="text-sm text-slate-500">
          Review submitted pet profiles and approve or reject them
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, species, breed, owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 mb-6">

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
          onClick={() => setFilter("in_review")}
          className={`px-3 py-1 text-xs rounded-full ${
            filter === "in_review"
              ? "bg-yellow-500 text-white"
              : "bg-white border"
          }`}
        >
          In Review
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
              ? "bg-red-500 text-white"
              : "bg-white border"
          }`}
        >
          Rejected
        </button>

      </div>

      {/* LIST */}
      <div className="space-y-3">

        {filteredPets.length === 0 && (
          <div className="text-center text-slate-500 p-6 bg-white rounded-lg">
            No registration requests found
          </div>
        )}

        {filteredPets.map((pet) => (
          <div
            key={pet._id}
            onClick={() => ViewModal(pet)}
            className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50"
          >

            {/* LEFT */}
            <div className="flex gap-4 items-center">

              <img
                src={pet.imageUrl}
                className="w-12 h-12 rounded-full object-cover bg-slate-200"
              />

              <div>
                <div className="font-semibold text-slate-800">
                  {pet.name}
                </div>

                <div className="text-sm text-slate-500">
                  {pet.species} • {pet.breed || "Unknown breed"}
                </div>

                <div className="text-xs text-slate-400">
                  Reason: {pet.registrationReason}
                </div>
              </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              <StatusBadge status={pet.reviewStatus} />

              {pet.reviewStatus === "in_review" && (
                <>
                  <button
                    onClick={() => changeStatus(pet._id, "approved")}
                    className="px-3 py-1 text-xs bg-emerald-500 text-white rounded-2xl cursor-pointer hover:bg-emerald-600"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => changeStatus(pet._id, "rejected")}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded-2xl cursor-pointer hover:bg-red-600"
                  >
                    Reject
                  </button>
                </>
              )}

            </div>

          </div>
        ))}

      </div>
    </section>
    </>
  );
};

export default AdminPetRegistrationList;