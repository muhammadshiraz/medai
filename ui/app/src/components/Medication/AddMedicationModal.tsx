// src/components/Medication/AddMedicationModal.tsx
import { useState } from "react";
import type { Medication, PatientType, DrugType } from "@/types/medication";
//import { usePatients } from "@/hooks/usePatients";
interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (med: Omit<Medication, "id">) => void;
  patientTypes: PatientType[];
  drugTypes: DrugType[];
}

export function AddMedicationModal({
  isOpen,
  onClose,
  onSave,
  patientTypes,
  drugTypes,
}: AddMedicationModalProps) {
  const [form, setForm] = useState<Omit<Medication, "id">>({
    patient_id: 0,
    drug_id: 0,
    dosage: 0,
    dosage_unit: "mg",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-gray-600 dark:bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 dark:text-gray-300">
          Add New Medication
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Patient
            </label>
            <select
              required
              className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
              value={form.patient_id}
              onChange={(e) =>
                setForm({ ...form, patient_id: Number(e.target.value) })
              }
            >
              <option value="">Select Patient</option>
              {patientTypes.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Drug
            </label>
            <select
              required
              className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
              value={form.drug_id}
              onChange={(e) =>
                setForm({ ...form, drug_id: Number(e.target.value) })
              }
            >
              <option value="">Select Drug</option>
              {drugTypes.map((drug) => (
                <option key={drug.id} value={drug.id}>
                  {drug.drug_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Drug ID
            </label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
              value={form.drug_id}
              onChange={(e) =>
                setForm({ ...form, drug_id: Number(e.target.value) })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dosage
              </label>
              <input
                type="number"
                required
                step="0.01"
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={form.dosage}
                onChange={(e) =>
                  setForm({ ...form, dosage: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unit
              </label>
              <select
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={form.dosage_unit}
                onChange={(e) =>
                  setForm({ ...form, dosage_unit: e.target.value })
                }
              >
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="tablet">tablet</option>
                <option value="unit">unit</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-900 dark:bg-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-medical-primary text-white rounded hover:bg-medical-primary-dark"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
