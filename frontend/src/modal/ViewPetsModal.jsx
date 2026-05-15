const ViewPetsModal = ({ pet, onClose }) => {
  if (!pet) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-[750px] p-6 shadow-xl overflow-y-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-medium bg-blue-200 py-1 px-4 rounded-full font-semibold text-blue-500">
            Pet Details
          </h2>

          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">

          {/* BASIC INFO */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Info label="Name" value={pet.name} />
            <Info label="Species" value={pet.species} />
            <Info label="Breed" value={pet.breed || "—"} />
            <Info label="Age" value={pet.age ?? "—"} />
            <Info label="Weight (kg)" value={pet.weight ?? "—"} />
            <Info label="Size" value={pet.size || "—"} />
            <Info label="Temperament" value={pet.temperament || "—"} />
            <Info label="Registration Reason" value={pet.registrationReason} />
            <Info label="Review Status" value={pet.reviewStatus} />
          </div>

          {/* DESCRIPTION */}
          <Section title="Description">
            <p className="text-slate-900">
              {pet.description || "—"}
            </p>
          </Section>

          {/* IMAGE */}
          {pet.imageUrl && (
            <Section title="Image">
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="w-full max-h-72 object-cover rounded-xl"
              />
            </Section>
          )}

          {/* MEDICAL HISTORY */}
          <Section title="Medical Histories">
            {pet.medicalHistories?.length ? (
              pet.medicalHistories.map((h, i) => (
                <Card key={i}>
                  <p><b>Illness:</b> {h.illness || "—"}</p>
                  <p><b>Date:</b> {h.date || "—"}</p>
                  <p><b>Still Present:</b> {h.stillPresent ? "Yes" : "No"}</p>
                  <p><b>Notes:</b> {h.notes || "—"}</p>
                </Card>
              ))
            ) : (
              <Empty text="No medical history" />
            )}
          </Section>

          {/* MEDICATION HISTORY */}
          <Section title="Medication Histories">
            {pet.medicationHistories?.length ? (
              pet.medicationHistories.map((m, i) => (
                <Card key={i}>
                  <p><b>Medication:</b> {m.medication || "—"}</p>
                  <p><b>Dosage:</b> {m.dosage || "—"}</p>
                  <p><b>Start Date:</b> {m.startDate || "—"}</p>
                  <p><b>End Date:</b> {m.endDate || "—"}</p>
                  <p><b>Ongoing:</b> {m.ongoing ? "Yes" : "No"}</p>
                  <p><b>Notes:</b> {m.notes || "—"}</p>
                </Card>
              ))
            ) : (
              <Empty text="No medication history" />
            )}
          </Section>

          {/* VACCINATION RECORDS */}
          <Section title="Vaccination Records">
            {pet.vaccinationRecords?.length ? (
              pet.vaccinationRecords.map((v, i) => (
                <Card key={i}>
                  <p><b>Vaccine:</b> {v.vaccine || "—"}</p>
                  <p><b>Date:</b> {v.date || "—"}</p>
                  <p><b>Next Due:</b> {v.nextDue || "—"}</p>
                  <p><b>Veterinarian:</b> {v.veterinarian || "—"}</p>
                  <p><b>Notes:</b> {v.notes || "—"}</p>
                </Card>
              ))
            ) : (
              <Empty text="No vaccination records" />
            )}
          </Section>

          <Section title="Registration Information">
            <p className="text-gray-500 text-sm"><b>Registered By:</b> {pet.owner || "—"}</p>
            <p className="text-gray-500 text-sm"><b>Registered At:</b> {pet.createdAt || "—"}</p>
          </Section>

        </div>
      </div>
    </div>
  );
};

/* ---------- Helper Components ---------- */

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-slate-900 font-medium">{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const Card = ({ children }) => (
  <div className="border rounded-xl p-3 bg-white space-y-1">
    {children}
  </div>
);

const Empty = ({ text }) => (
  <p className="text-gray-500 text-sm">{text}</p>
);

export default ViewPetsModal;