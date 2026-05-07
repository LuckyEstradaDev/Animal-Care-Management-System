import { useState } from "react";
import {updatePet} from '../services/petService'

const EditPetsModal = ({pet, reFetch, onClose}) => {

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState(0);
    const [weight, setWeight] = useState(0);
    const [description, setDesciption] = useState("");

    const SavedChanges = async () => {
          const updatedData = {
            name: name,
            species: species,
            breed: breed,
            age: age,
            weight: weight,
            description: description
          }
          try {
            const isConfirmed = confirm("Are you sure you want to edit this pet?");
            if (!isConfirmed) return;

            const res = await updatePet(pet._id, updatedData);
            reFetch();
          } catch (error) {
            console.log(error)
          }
    }


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-full max-w-[600px] p-6 shadow-xl overflow-y-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-medium bg-blue-200 py-1 px-4 rounded-full font-semibold text-blue-500">
            Edit Pet {pet.name || "None"}
          </h2>

          <button className="text-gray-500 hover:text-red-500 text-xl cursor-pointer" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-slate-800 text-sm font-medium mb-1">
              Name
            </label>

            <input
              type="text"
              name="name"
              defaultValue={pet.name || "None"}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 w-full bg-gray-200 outline-none text-gray-500 rounded-xl px-3 py-2"
            />
          </div>

          {/* Species */}
          <div>
            <label className="block text-slate-800 text-sm font-medium mb-1">
              Species
            </label>

            <input
              type="text"
              name="species"
              defaultValue={pet.species || "None"}
              onChange={(e) => setSpecies(e.target.value)}
              required
              className="h-12 w-full bg-gray-200 outline-none text-gray-500 rounded-xl px-3 py-2"
            />
          </div>

          {/* Breed */}
          <div>
            <label className="block text-slate-800 text-sm font-medium mb-1">
              Breed
            </label>

            <input
              type="text"
              name="breed"
              defaultValue={pet.breed || "None"}
              onChange={(e) => setBreed(e.target.value)}
              required
              className="h-12 w-full bg-gray-200 outline-none text-gray-500 rounded-xl px-3 py-2"
            />
          </div>

          <div className="justify-start items-center flex gap-4">
               {/* Age */}
          <div>
            <label className="block text-slate-800 text-sm font-medium mb-1">
              Age
            </label>

            <input
              type="text"
              name="age"
              defaultValue={pet.age || "None"}
              onChange={(e) => setAge(e.target.value)}
              required
              className="h-12 w-full bg-gray-200 outline-none text-gray-500 rounded-xl px-3 py-2"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-slate-800 text-sm font-medium mb-1">
              Weight
            </label>

            <input
              type="text"
              name="weight"
              defaultValue={pet.weight || "None"}
              onChange={(e) => setWeight(e.target.value)}
              required
              className="h-12 w-full bg-gray-200 outline-none text-gray-500 rounded-xl px-3 py-2"
            />
          </div>
          </div>
          

          {/* Description */}
          <div>
            <label className="block text-slate-800 text-sm font-medium mb-1">
              Description
            </label>

            <textarea
              name="description"
              defaultValue={pet.description || "None"}
              onChange={(e) => setDesciption(e.target.value)}
              required
              className="w-full bg-gray-200 outline-none text-gray-500 rounded-xl px-3 py-2"
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">

            <button type="submit" className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
              Save Changes
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPetsModal;
