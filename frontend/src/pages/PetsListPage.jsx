import {CardDescription, CardTitle} from "../components/ui/card";
import EditPetsModal from "../modal/EditPetsModal";
import {getAllPets, deletePet as removePet} from "../services/petService";
import {useEffect, useState} from "react";

const PetsListPage = () => {
  const [pets, setPets] = useState([]);

  const mockPets = [
  {
    _id: "1",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: 3,
    weight: 28,
    description: "Friendly and energetic dog who loves playing fetch.",
    imageUrl: "https://example.com/images/buddy.jpg",
    registrationReason: "adoption",
    owner: "John Doe",
    createdAt: "2026-01-10",
    updatedAt: "2026-01-12",
  },
  {
    _id: "2",
    name: "Mittens",
    species: "Cat",
    breed: "British Shorthair",
    age: 2,
    weight: 5,
    description: "Calm indoor cat who enjoys sleeping all day.",
    imageUrl: "https://example.com/images/mittens.jpg",
    registrationReason: "personal_use",
    owner: "Jane Smith",
    createdAt: "2026-01-08",
    updatedAt: "2026-01-09",
  },
  {
    _id: "3",
    name: "Rocky",
    species: "Dog",
    breed: "German Shepherd",
    age: 5,
    weight: 35,
    description: "Strong and intelligent guard dog.",
    imageUrl: "https://example.com/images/rocky.jpg",
    registrationReason: "breeding",
    owner: "Mike Johnson",
    createdAt: "2026-01-05",
    updatedAt: "2026-01-07",
  },
  {
    _id: "4",
    name: "Luna",
    species: "Rabbit",
    breed: "Holland Lop",
    age: 1,
    weight: 2,
    description: "Small and gentle rabbit, very friendly with kids.",
    imageUrl: "https://example.com/images/luna.jpg",
    registrationReason: "rescue",
    owner: "Emily Clark",
    createdAt: "2026-01-11",
    updatedAt: "2026-01-13",
  },
];

  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [search, setSearch] = useState("");

  const filterPets = mockPets.filter((pet) => (pet.name.toLowerCase().includes(search.toLowerCase()) ||
                                               pet.owner.toLowerCase().includes(search.toLowerCase()) ||
                                               pet.breed.toLowerCase().includes(search.toLowerCase()) ||
                                               pet.species.toLowerCase().includes(search.toLowerCase())
  ));

  const fetchedPets = async () => {
    try {
      const res = await getAllPets();
      setPets(res.pets);
      console.log(res.pets);
    } catch (error) {
      console.log(error);
    }
  };

  const OpenEditModal = (pet) => {
    setIsEditModal(true);
    setSelectedPet(pet);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchedPets();
  }, []);
  return (
    <section className="min-h-screen w-full bg-transparent">
      {isEditModal && (
        <EditPetsModal
          pet={selectedPet}
          reFetch={() => fetchedPets()}
          onClose={() => setIsEditModal(false)}
        />
      )}
      <div className="rounded-md space-y-6">
        <div className="justify-between items-center flex">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
            Registered Pet List
            </CardTitle>
            <CardDescription className="text-slate-600">
              Adoption applications begin as pending and update after review.
            </CardDescription>
          </div>
          

          <div className="w-100 gap-2">
            <input type="text"
                   placeholder="Search pets..."
                   className="bg-white border border-gray-300 rounded-2xl outline-none placeholder:text-gray-500 text-gray-900 focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {mockPets.length < 1 && (
          <div className="bg-slate-100 h-100 w-full rounded-xl justify-center items-center flex">
            <h1 className="text-sm text-slate-500 font-semibold">
              No registered pets yet
            </h1>
          </div>
        )}

        <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-5">
          {filterPets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Header */}
              <div>
                <div className="flex justify-between items-center gap-3 border-b border-gray-500 pb-3 mb-3">
                  <div className="justify-center items-center flex gap-4">
                    <img
                      src={pet.imageUrl}
                      className="h-12 w-12 rounded-full object-cover border-2 border-green-500"
                    />
                    <div>
                      <h1 className="text-md font-semibold text-gray-800">
                        {pet.name} <span className="text-gray-500">{`${pet.age} years old`}</span>
                      </h1>
                      <h1 className="text-xs font-semibold text-gray-500">
                        Owner: {pet?.owner || "Owner name"}
                      </h1>
                    </div>
                  </div>

                </div>

                {/* Info */}
                <ul className="space-y-1 text-sm text-gray-700 mb-4">
                  <li>
                    🐶 <span className="font-medium">Species:</span>{" "}
                    {pet.species}
                  </li>
                  <li>
                    🐾 <span className="font-medium">Breed:</span> {pet.breed}
                  </li>
                  <li>
                    📏 <span className="font-medium">Size:</span> {pet.size}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PetsListPage;
