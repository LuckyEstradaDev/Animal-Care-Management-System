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

const PetsListPage = () => {
    return(
        <section className="min-h-screen w-full bg-trnasparent">
  <div className="shadow-xl rounded-md h-1000">
    
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-white">
        🐾 Pets List
      </CardTitle>
      <CardDescription className="text-white">
        Adoption applications begin as pending and update after review.
      </CardDescription>
    </CardHeader>

    <div className="max-h-[500px] w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-5">

      {availablePets.map((pet) => (
  <div
    key={pet.id}
    className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
  >
    
    {/* Header */}
    <div>
      <div className="flex items-center gap-3 border-b pb-3 mb-3">
        <img
          src={pet.imageUrl}
          className="h-12 w-12 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-md font-semibold text-gray-800">
            {pet.name}
          </h1>
          <p className="text-sm text-gray-500">{pet.age}</p>
        </div>
      </div>

      {/* Info */}
      <ul className="space-y-1 text-sm text-gray-700 mb-4">
        <li>🐶 <span className="font-medium">Species:</span> {pet.species}</li>
        <li>🐾 <span className="font-medium">Breed:</span> {pet.breed}</li>
        <li>📏 <span className="font-medium">Size:</span> {pet.size}</li>
      </ul>
    </div>

    {/* Actions */}
    <div className="gap-2 justify-end items-center flex">
      <button
        onClick={() => handleEdit(pet)}
        className="px-4 h-12 bg-gray-300 hover:bg-gray-500 text-white text-sm py-2 rounded-lg transition"
      >
        ✏️ Edit
      </button>

      <button
        onClick={() => handleDelete(pet.id)}
        className="px-4 h-12 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg transition"
      >
        🗑 Delete
      </button>
    </div>

  </div>
))}

    </div>
  </div>
</section>
    )
}
export default PetsListPage