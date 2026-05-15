import {CardDescription, CardTitle} from "../components/ui/card";
import EditPetsModal from "../modal/EditPetsModal";
import {getAllPets, deletePet as removePet} from "../services/petService";
import {useEffect, useState} from "react";

const PetsListPage = () => {
  const [pets, setPets] = useState([]);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const fetchPets = async () => {
    try {
      const res = await getAllPets();
      setPets(res.pets ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePet = async (id) => {
    const isConfirmed = confirm("Are you sure you want to delete this pet?");
    if (!isConfirmed) return;

    try {
      await removePet(id);
      fetchPets();
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (pet) => {
    setSelectedPet(pet);
    setIsEditModal(true);
  };

  useEffect(() => {
    fetchPets();
  }, []);
  return (
    <section className="min-h-screen w-full bg-transparent">
      {isEditModal && (
        <EditPetsModal
          pet={selectedPet}
          reFetch={() => fetchPets()}
          onClose={() => setIsEditModal(false)}
        />
      )}
      <div className="rounded-md space-y-6">
        <div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Registered Pet List
          </CardTitle>
          <CardDescription className="text-slate-600">
            Adoption applications begin as pending and update after review.
          </CardDescription>
        </div>

        {pets.length === 0 ? (
          <div className="bg-slate-100 h-100 w-full rounded-xl justify-center items-center flex">
            <h1 className="text-sm text-slate-500 font-semibold">
              No registered pets yet
            </h1>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-5">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header */}
                <div>
                  <div className="flex justify-between items-center gap-3 border-b border-gray-500 pb-3 mb-3">
                    <div className="justify-center items-center flex gap-4">
                      <img
                        src={pet.imageUrl || "https://via.placeholder.com/120"}
                        alt={pet.name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-green-500"
                      />
                      <div>
                        <h1 className="text-md font-semibold text-gray-800">
                          {pet.name}{" "}
                          <span className="text-gray-500">
                            {pet.age ? `${pet.age} years old` : ""}
                          </span>
                        </h1>
                        <h1 className="text-xs font-semibold text-gray-500">
                          Owner: {pet.owner || "Owner name"}
                        </h1>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="gap-2 justify-end items-center flex">
                      <button
                        type="button"
                        onClick={() => openEditModal(pet)}
                        className="w-12 h-12 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm rounded-2xl transition"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePet(pet._id)}
                        className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white text-sm rounded-2xl transition"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <ul className="space-y-1 text-sm text-gray-700 mb-4">
                    <li>
                      🐶 <span className="font-medium">Species:</span>{" "}
                      {pet.species}
                    </li>
                    <li>
                      🐾 <span className="font-medium">Breed:</span>{" "}
                      {pet.breed || "Unknown"}
                    </li>
                    <li>
                      ⚖️ <span className="font-medium">Weight:</span>{" "}
                      {pet.weight ? `${pet.weight} kg` : "N/A"}
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default PetsListPage;
