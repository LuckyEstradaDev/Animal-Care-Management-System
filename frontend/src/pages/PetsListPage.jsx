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

import EditPetsModal from "../modal/EditPetsModal";

import {getAllPets, deletePet} from '../services/petService'
import { useEffect, useState } from "react";

const PetsListPage = () => {
  const [pets, setPets] = useState([]);

  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const fetchedPets = async () =>{
        try {
          const res = await getAllPets();
          setPets(res.pets);
        } catch (error) {
          console.log(error)
        }
  }

  const deletePet = async (id) => {
        const isConfirmed = confirm("Are you sure you want to delete this pet?");
        if (!isConfirmed) return;

        try {
          await deletePet(id);
          fetchedPets();
        } catch (error) {
          console.log(error)
        }
  }

  const updatePet = async () => {
        try {
          
        } catch (error) {
          console.log(error)
        }
  }

  const OpenEditModal = (pet) => {
        setIsEditModal(true);
        setSelectedPet(pet);
  }

  useEffect(() => {
        // fetchedPets()
  },[])
    return(
        <section className="min-h-screen w-full bg-trnasparent">
        {isEditModal && (<EditPetsModal pet={selectedPet}
                                        reFetch={() => fetchedPets()}
                                        onClose={() => setIsEditModal(false)}
        
        />)}
  <div className="shadow-xl rounded-md">
    
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-white">
        🐾 Pets List
      </CardTitle>
      <CardDescription className="text-white">
        Adoption applications begin as pending and update after review.
      </CardDescription>
    </CardHeader>

     {pets.length < 1 && (
        <div className="bg-slate-950 h-100 w-full rounded-xl justify-center items-center flex">
          <h1 className="text-sm text-gray-500 font-semibold">No registered pets yet</h1>
        </div>
      )}

    <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-5">

      {pets.map((pet) => (
        <div
          key={pet.id}
          className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          
          {/* Header */}
          <div>
            <div className="flex justify-between items-center gap-3 border-b pb-3 mb-3">

              
              <div className="justify-center items-center flex gap-4">
              <img src={pet.imageUrl} className="h-12 w-12 rounded-full object-cover border"/>
              <h1 className="text-md font-semibold text-gray-800">
                  {pet.name}
              </h1>
              <p className="text-sm text-gray-500">{pet.age}</p>
              </div>

               {/* Actions */}
              <div className="gap-2 justify-end items-center flex">
                  <button onClick={() => OpenEditModal(pet)} className="w-12 h-12 bg-gray-300 hover:bg-gray-400 text-white text-sm py-2 rounded-2xl transition cursor-pointer">
                    ✏️
                  </button>

                  <button onClick={() => deletePet(pet._id)} className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-2xl transition cursor-pointer">
                    🗑
                  </button>
              </div>
            </div>

            {/* Info */}
            <ul className="space-y-1 text-sm text-gray-700 mb-4">
              <li>🐶 <span className="font-medium">Species:</span> {pet.species}</li>
              <li>🐾 <span className="font-medium">Breed:</span> {pet.breed}</li>
              <li>📏 <span className="font-medium">Size:</span> {pet.size}</li>
            </ul>
          </div>

        </div>
))}

    </div>
  </div>
</section>
    )
}
export default PetsListPage