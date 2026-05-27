const ViewPetsRegistrationModal = ({ pet, onClose}) => {

    if (!pet) return null;

    return (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-xl">

                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Pet Registration Details
                        </h1>

                        <p className="text-sm text-slate-500">
                            Review submitted pet information
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200"
                    >
                        ✕
                    </button>

                </div>

                {/* CONTENT */}
                <div className="p-6 space-y-8">

                    {/* PET BASIC INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* IMAGE */}
                        <div className="flex flex-col items-center">

                            <img
                                src={pet.imageUrl || "https://placehold.co/300x300"}
                                alt={pet.name}
                                className="w-64 h-64 rounded-2xl object-cover border"
                            />

                            <div className="mt-4 text-center">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {pet.name}
                                </h2>

                                <p className="text-slate-500">
                                    {pet.species} • {pet.breed || "Unknown Breed"}
                                </p>
                            </div>

                        </div>

                        {/* DETAILS */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="bg-slate-50 rounded-2xl p-4">
                                <p className="text-xs text-slate-400">Age</p>
                                <h3 className="font-semibold text-slate-800">
                                    {pet.age || "—"} years old
                                </h3>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4">
                                <p className="text-xs text-slate-400">Weight</p>
                                <h3 className="font-semibold text-slate-800">
                                    {pet.weight || "—"} kg
                                </h3>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4">
                                <p className="text-xs text-slate-400">Temperament</p>
                                <h3 className="font-semibold text-slate-800">
                                    {pet.temperament || "—"}
                                </h3>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4">
                                <p className="text-xs text-slate-400">
                                    Registration Reason
                                </p>

                                <h3 className="font-semibold text-slate-800 capitalize">
                                    {pet.registrationReason?.replace("_", " ")}
                                </h3>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4 md:col-span-2">
                                <p className="text-xs text-slate-400">
                                    Description
                                </p>

                                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                                    {pet.description || "No description provided"}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* MEDICAL HISTORY */}
                    <div>

                        <h2 className="text-lg font-bold text-slate-800 mb-4">
                            Medical History
                        </h2>

                        {pet.medicalHistories?.length === 0 ? (
                            <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-500">
                                No medical history found
                            </div>
                        ) : (
                            <div className="space-y-3">

                                {pet.medicalHistories.map((history, index) => (
                                    <div
                                        key={index}
                                        className="bg-slate-50 p-4 rounded-2xl"
                                    >

                                        <div className="flex justify-between items-start">

                                            <div>
                                                <h3 className="font-semibold text-slate-800">
                                                    {history.illness}
                                                </h3>

                                                <p className="text-sm text-slate-500">
                                                    {history.date}
                                                </p>
                                            </div>

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    history.stillPresent
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {history.stillPresent
                                                    ? "Still Present"
                                                    : "Recovered"}
                                            </span>

                                        </div>

                                        <p className="text-sm text-slate-600 mt-2">
                                            {history.notes || "No notes"}
                                        </p>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                    {/* MEDICATION HISTORY */}
                    <div>

                        <h2 className="text-lg font-bold text-slate-800 mb-4">
                            Medication History
                        </h2>

                        {pet.medicationHistories?.length === 0 ? (
                            <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-500">
                                No medication history found
                            </div>
                        ) : (
                            <div className="space-y-3">

                                {pet.medicationHistories.map((medication, index) => (
                                    <div
                                        key={index}
                                        className="bg-slate-50 p-4 rounded-2xl"
                                    >

                                        <div className="flex justify-between items-start">

                                            <div>
                                                <h3 className="font-semibold text-slate-800">
                                                    {medication.medication}
                                                </h3>

                                                <p className="text-sm text-slate-500">
                                                    {medication.dosage}
                                                </p>
                                            </div>

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    medication.ongoing
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {medication.ongoing
                                                    ? "Ongoing"
                                                    : "Completed"}
                                            </span>

                                        </div>

                                        <div className="mt-2 text-sm text-slate-600">
                                            {medication.startDate} -{" "}
                                            {medication.endDate || "Present"}
                                        </div>

                                        <p className="text-sm text-slate-600 mt-2">
                                            {medication.notes || "No notes"}
                                        </p>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                    {/* VACCINATION RECORDS */}
                    <div>

                        <h2 className="text-lg font-bold text-slate-800 mb-4">
                            Vaccination Records
                        </h2>

                        {pet.vaccinationRecords?.length === 0 ? (
                            <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-500">
                                No vaccination records found
                            </div>
                        ) : (
                            <div className="space-y-3">

                                {pet.vaccinationRecords.map((vaccine, index) => (
                                    <div
                                        key={index}
                                        className="bg-slate-50 p-4 rounded-2xl"
                                    >

                                        <div className="flex justify-between items-start">

                                            <div>
                                                <h3 className="font-semibold text-slate-800">
                                                    {vaccine.vaccine}
                                                </h3>

                                                <p className="text-sm text-slate-500">
                                                    Veterinarian: {vaccine.veterinarian || "—"}
                                                </p>
                                            </div>

                                            <div className="text-right text-sm text-slate-500">
                                                <p>Date: {vaccine.date}</p>
                                                <p>Next Due: {vaccine.nextDue}</p>
                                            </div>

                                        </div>

                                        <p className="text-sm text-slate-600 mt-2">
                                            {vaccine.notes || "No notes"}
                                        </p>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </section>
    );
};

export default ViewPetsRegistrationModal;