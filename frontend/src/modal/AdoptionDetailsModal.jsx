
const AdoptionDetailsModal = ({ selectedPet, onClose }) => {
  if (!selectedPet) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >

      <div
        className="bg-white rounded-2xl w-full max-w-[650px] shadow-xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">
            Adoption Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-5 text-sm text-gray-700">

          {/* USER INFO */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Applicant Information
            </h3>
            <p><b>Name:</b> {selectedPet.fullName}</p>
            <p><b>Email:</b> {selectedPet.email}</p>
            <p><b>Phone:</b> {selectedPet.phone}</p>
          </div>

          {/* LIVING CONDITIONS */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Living Conditions
            </h3>
            <p><b>Home Type:</b> {selectedPet.homeType}</p>
            <p><b>Household Size:</b> {selectedPet.householdSize}</p>
            <p><b>Has Children:</b> {selectedPet.hasChildren}</p>
            <p><b>Has Other Pets:</b> {selectedPet.hasOtherPets}</p>
          </div>

          {/* EXPERIENCE */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Experience & Schedule
            </h3>
            <p><b>Experience:</b> {selectedPet.experience}</p>
            <p><b>Daily Schedule:</b> {selectedPet.dailySchedule}</p>
          </div>

          {/* REASONS & CARE */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Adoption Plan
            </h3>
            <p><b>Reason:</b> {selectedPet.reason}</p>
            <p><b>Care Plan:</b> {selectedPet.carePlan}</p>
            <p><b>Financial Plan:</b> {selectedPet.financialPlan}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdoptionDetailsModal;