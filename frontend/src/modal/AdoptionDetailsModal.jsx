const AdoptionDetailsModal = ({ selectedPet, onClose }) => {
  if (!selectedPet) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >

      {/* MODAL */}
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Adoption Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Review applicant information and adoption plans
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-black cursor-pointer"
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-6 space-y-6">

          {/* APPLICANT INFO */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Applicant Information
              </h3>

              <p className="text-sm text-gray-500">
                Personal contact details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Full Name
                </p>

                <p className="font-medium text-gray-800">
                  {selectedPet.fullName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Email Address
                </p>

                <p className="font-medium text-gray-800">
                  {selectedPet.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Phone Number
                </p>

                <p className="font-medium text-gray-800">
                  {selectedPet.phone}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Current Status
                </p>

                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium
                  ${
                    selectedPet.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : selectedPet.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedPet.status.replace("_", " ")}
                </span>
              </div>

            </div>
          </div>

          {/* LIVING CONDITIONS */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Living Conditions
              </h3>

              <p className="text-sm text-gray-500">
                Home environment and household details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Home Type
                </p>

                <p className="font-medium text-gray-800">
                  {selectedPet.homeType}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Household Size
                </p>

                <p className="font-medium text-gray-800">
                  {selectedPet.householdSize}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Has Children
                </p>

                <p className="font-medium text-gray-800">
                  {selectedPet.hasChildren}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Has Other Pets
                </p>

                <p className="font-medium text-gray-800">
                  {selectedPet.hasOtherPets}
                </p>
              </div>

            </div>
          </div>

          {/* EXPERIENCE */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Experience & Schedule
              </h3>

              <p className="text-sm text-gray-500">
                Lifestyle and pet ownership background
              </p>
            </div>

            <div className="space-y-4">

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Pet Experience
                </p>

                <p className="font-medium text-gray-800 leading-relaxed">
                  {selectedPet.experience}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Daily Schedule
                </p>

                <p className="font-medium text-gray-800 leading-relaxed">
                  {selectedPet.dailySchedule}
                </p>
              </div>

            </div>
          </div>

          {/* ADOPTION PLAN */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Adoption Plan
              </h3>

              <p className="text-sm text-gray-500">
                Motivation and long-term care planning
              </p>
            </div>

            <div className="space-y-5">

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Reason for Adoption
                </p>

                <p className="font-medium text-gray-800 leading-relaxed">
                  {selectedPet.reason}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Care Plan
                </p>

                <p className="font-medium text-gray-800 leading-relaxed">
                  {selectedPet.carePlan}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Financial Plan
                </p>

                <p className="font-medium text-gray-800 leading-relaxed">
                  {selectedPet.financialPlan}
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdoptionDetailsModal;