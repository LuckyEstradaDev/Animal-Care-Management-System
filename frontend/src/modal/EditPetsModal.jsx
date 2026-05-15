import {useEffect, useState} from "react";
import {updatePet} from "../services/petService";

const emptyMedicalHistory = {
  illness: "",
  date: "",
  stillPresent: false,
  notes: "",
};

const emptyMedicationHistory = {
  medication: "",
  dosage: "",
  startDate: "",
  endDate: "",
  ongoing: false,
  notes: "",
};

const emptyVaccinationRecord = {
  vaccine: "",
  date: "",
  nextDue: "",
  veterinarian: "",
  notes: "",
};

const EditPetsModal = ({pet, reFetch, onClose}) => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [medicalHistories, setMedicalHistories] = useState([
    emptyMedicalHistory,
  ]);
  const [medicationHistories, setMedicationHistories] = useState([
    emptyMedicationHistory,
  ]);
  const [vaccinationRecords, setVaccinationRecords] = useState([
    emptyVaccinationRecord,
  ]);
  const [registrationReason, setRegistrationReason] = useState("personal_use");

  useEffect(() => {
    if (!pet) return;
    setName(pet.name || "");
    setSpecies(pet.species || "");
    setBreed(pet.breed || "");
    setAge(pet.age?.toString() || "");
    setWeight(pet.weight?.toString() || "");
    setDescription(pet.description || "");
    setRegistrationReason(pet.registrationReason || "personal_use");
    setMedicalHistories(
      pet.medicalHistories?.length > 0
        ? pet.medicalHistories
        : [emptyMedicalHistory],
    );
    setMedicationHistories(
      pet.medicationHistories?.length > 0
        ? pet.medicationHistories
        : [emptyMedicationHistory],
    );
    setVaccinationRecords(
      pet.vaccinationRecords?.length > 0
        ? pet.vaccinationRecords
        : [emptyVaccinationRecord],
    );
  }, [pet]);

  function updateMedicalHistory(index, field, value) {
    setMedicalHistories((current) => {
      const updated = [...current];
      updated[index] = {...updated[index], [field]: value};
      return updated;
    });
  }

  function addMedicalHistory() {
    setMedicalHistories((current) => [...current, emptyMedicalHistory]);
  }

  function removeMedicalHistory(index) {
    setMedicalHistories((current) => current.filter((_, idx) => idx !== index));
  }

  function updateMedicationHistory(index, field, value) {
    setMedicationHistories((current) => {
      const updated = [...current];
      updated[index] = {...updated[index], [field]: value};
      return updated;
    });
  }

  function addMedicationHistory() {
    setMedicationHistories((current) => [...current, emptyMedicationHistory]);
  }

  function removeMedicationHistory(index) {
    setMedicationHistories((current) =>
      current.filter((_, idx) => idx !== index),
    );
  }

  function updateVaccinationRecord(index, field, value) {
    setVaccinationRecords((current) => {
      const updated = [...current];
      updated[index] = {...updated[index], [field]: value};
      return updated;
    });
  }

  function addVaccinationRecord() {
    setVaccinationRecords((current) => [...current, emptyVaccinationRecord]);
  }

  function removeVaccinationRecord(index) {
    setVaccinationRecords((current) =>
      current.filter((_, idx) => idx !== index),
    );
  }

  const saveChanges = async (event) => {
    event.preventDefault();

    try {
      const confirmed = confirm(
        "Are you sure you want to save changes to this pet?",
      );
      if (!confirmed) return;

      await updatePet(pet._id, {
        name: name.trim(),
        species: species.trim(),
        breed: breed.trim(),
        age: age ? Number.parseInt(age, 10) : undefined,
        weight: weight ? Number.parseFloat(weight) : undefined,
        description: description.trim(),
        registrationReason,
        medicalHistories: medicalHistories.filter(
          (entry) => entry.illness || entry.date || entry.notes,
        ),
        medicationHistories: medicationHistories.filter(
          (entry) =>
            entry.medication ||
            entry.dosage ||
            entry.startDate ||
            entry.endDate ||
            entry.notes,
        ),
        vaccinationRecords: vaccinationRecords.filter(
          (entry) => entry.vaccine || entry.date || entry.notes,
        ),
      });
      reFetch();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-[700px] p-6 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-medium bg-blue-200 py-1 px-4 rounded-full font-semibold text-blue-500">
            Edit Pet {pet?.name || "None"}
          </h2>
          <button
            type="button"
            className="text-gray-500 hover:text-red-500 text-xl cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={saveChanges}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="block text-slate-800 text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 w-full bg-gray-100 outline-none text-slate-900 rounded-xl px-3 py-2"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="block text-slate-800 text-sm font-medium mb-1">
                Species
              </label>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                required
                className="h-12 w-full bg-gray-100 outline-none text-slate-900 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="block text-slate-800 text-sm font-medium mb-1">
                Breed
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="h-12 w-full bg-gray-100 outline-none text-slate-900 rounded-xl px-3 py-2"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="block text-slate-800 text-sm font-medium mb-1">
                  Age
                </label>
                <input
                  type="number"
                  min="0"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-12 w-full bg-gray-100 outline-none text-slate-900 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="block text-slate-800 text-sm font-medium mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-12 w-full bg-gray-100 outline-none text-slate-900 rounded-xl px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-slate-800 text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-gray-100 outline-none text-slate-900 rounded-xl px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-slate-800 text-sm font-medium mb-1">
              Registration reason
            </label>
            <select
              value={registrationReason}
              onChange={(e) => setRegistrationReason(e.target.value)}
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
            >
              <option value="personal_use">Personal use</option>
              <option value="adoption">For adoption</option>
              <option value="breeding">Breeding</option>
              <option value="rescue">Rescue</option>
            </select>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Medical histories
                </p>
                <p className="text-xs text-zinc-500">
                  Track illnesses, when they happened, and whether they are
                  ongoing.
                </p>
              </div>
              <button
                type="button"
                onClick={addMedicalHistory}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
              >
                + Add
              </button>
            </div>
            <div className="space-y-4">
              {medicalHistories.map((entry, index) => (
                <div
                  key={`medical-edit-${index}`}
                  className="space-y-3 rounded-2xl border border-zinc-100 bg-white p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="block text-slate-800 text-sm font-medium">
                        Illness
                      </label>
                      <input
                        type="text"
                        value={entry.illness}
                        onChange={(event) =>
                          updateMedicalHistory(
                            index,
                            "illness",
                            event.target.value,
                          )
                        }
                        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="block text-slate-800 text-sm font-medium">
                        Date
                      </label>
                      <input
                        type="date"
                        value={entry.date}
                        onChange={(event) =>
                          updateMedicalHistory(
                            index,
                            "date",
                            event.target.value,
                          )
                        }
                        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`medical-ongoing-${index}`}
                      checked={entry.stillPresent}
                      onChange={(event) =>
                        updateMedicalHistory(
                          index,
                          "stillPresent",
                          event.target.checked,
                        )
                      }
                      className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label
                      htmlFor={`medical-ongoing-${index}`}
                      className="text-sm text-zinc-600"
                    >
                      Ongoing
                    </label>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="block text-slate-800 text-sm font-medium">
                      Notes
                    </label>
                    <textarea
                      value={entry.notes}
                      onChange={(event) =>
                        updateMedicalHistory(index, "notes", event.target.value)
                      }
                      rows={3}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  {medicalHistories.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeMedicalHistory(index)}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700"
                    >
                      Remove history
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Medication histories
                </p>
                <p className="text-xs text-zinc-500">
                  Track medicines, doses, dates, and ongoing treatments.
                </p>
              </div>
              <button
                type="button"
                onClick={addMedicationHistory}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
              >
                + Add
              </button>
            </div>
            <div className="space-y-4">
              {medicationHistories.map((entry, index) => (
                <div
                  key={`medication-edit-${index}`}
                  className="space-y-3 rounded-2xl border border-zinc-100 bg-white p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="block text-slate-800 text-sm font-medium">
                        Medication
                      </label>
                      <input
                        type="text"
                        value={entry.medication}
                        onChange={(event) =>
                          updateMedicationHistory(
                            index,
                            "medication",
                            event.target.value,
                          )
                        }
                        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="block text-slate-800 text-sm font-medium">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={entry.dosage}
                        onChange={(event) =>
                          updateMedicationHistory(
                            index,
                            "dosage",
                            event.target.value,
                          )
                        }
                        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="block text-slate-800 text-sm font-medium">
                        Start date
                      </label>
                      <input
                        type="date"
                        value={entry.startDate}
                        onChange={(event) =>
                          updateMedicationHistory(
                            index,
                            "startDate",
                            event.target.value,
                          )
                        }
                        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="block text-slate-800 text-sm font-medium">
                        End date
                      </label>
                      <input
                        type="date"
                        value={entry.endDate}
                        onChange={(event) =>
                          updateMedicationHistory(
                            index,
                            "endDate",
                            event.target.value,
                          )
                        }
                        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        id={`medication-ongoing-${index}`}
                        type="checkbox"
                        checked={entry.ongoing}
                        onChange={(event) =>
                          updateMedicationHistory(
                            index,
                            "ongoing",
                            event.target.checked,
                          )
                        }
                        className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label
                        htmlFor={`medication-ongoing-${index}`}
                        className="text-sm text-zinc-600"
                      >
                        Ongoing
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="block text-slate-800 text-sm font-medium">
                      Notes
                    </label>
                    <textarea
                      value={entry.notes}
                      onChange={(event) =>
                        updateMedicationHistory(
                          index,
                          "notes",
                          event.target.value,
                        )
                      }
                      rows={3}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  {medicationHistories.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeMedicationHistory(index)}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700"
                    >
                      Remove medication
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Vaccination records
                </p>
                <p className="text-xs text-zinc-500">
                  Track vaccinations, dates, and next due dates.
                </p>
              </div>
              <button
                type="button"
                onClick={addVaccinationRecord}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
              >
                + Add
              </button>
            </div>
            <div className="space-y-4">
              {vaccinationRecords.map((entry, index) => (
                <div
                  key={`vaccination-edit-${index}`}
                  className="space-y-3 rounded-2xl border border-zinc-100 bg-white p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="block text-slate-800 text-sm font-medium">
                        Vaccine
                      </label>
                      <input
                        type="text"
                        value={entry.vaccine}
                        onChange={(event) =>
                          updateVaccinationRecord(
                            index,
                            "vaccine",
                            event.target.value,
                          )
                        }
                        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="block text-slate-800 text-sm font-medium">
                        Date administered
                      </label>
                      <input
                        type="date"
                        value={entry.date}
                        onChange={(event) =>
                          updateVaccinationRecord(
                            index,
                            "date",
                            event.target.value,
                          )
                        }
                        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="block text-slate-800 text-sm font-medium">
                        Next due date
                      </label>
                      <input
                        type="date"
                        value={entry.nextDue}
                        onChange={(event) =>
                          updateVaccinationRecord(
                            index,
                            "nextDue",
                            event.target.value,
                          )
                        }
                        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="block text-slate-800 text-sm font-medium">
                        Veterinarian
                      </label>
                      <input
                        type="text"
                        value={entry.veterinarian}
                        onChange={(event) =>
                          updateVaccinationRecord(
                            index,
                            "veterinarian",
                            event.target.value,
                          )
                        }
                        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="block text-slate-800 text-sm font-medium">
                      Notes
                    </label>
                    <textarea
                      value={entry.notes}
                      onChange={(event) =>
                        updateVaccinationRecord(
                          index,
                          "notes",
                          event.target.value,
                        )
                      }
                      rows={3}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  {vaccinationRecords.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeVaccinationRecord(index)}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700"
                    >
                      Remove vaccination
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPetsModal;
