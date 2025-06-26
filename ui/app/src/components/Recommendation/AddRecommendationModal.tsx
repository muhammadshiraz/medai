// src/components/Recommendation/AddRecommendationModal.tsx
import { useState } from "react";
import type { DrugType, PatientType } from "@/types/recommendation";

interface AddRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (recommendation: any) => void;
  drugTypes: DrugType[];
  patientTypes: PatientType[];
}

export const AddRecommendationModal = ({
  isOpen,
  onClose,
  onSave,
  drugTypes,
  patientTypes,
}: AddRecommendationModalProps) => {
  const [formData, setFormData] = useState({
    patient_id: "",
    drug_id: "",
    dosage: "",
    dosage_unit: "mg",
    time_of_reading: "breakfast",
    recommendation_date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      patient_id: Number(formData.patient_id),
      drug_id: Number(formData.drug_id),
      dosage: parseFloat(formData.dosage),
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-gray-600 dark:bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          New Clinical Recommendation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Patient
                </label>
                <select
                  className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  value={formData.patient_id}
                  onChange={(e) =>
                    setFormData({ ...formData, patient_id: e.target.value })
                  }
                  required
                >
                  <option value="">Choose Patient</option>
                  {patientTypes.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      #{patient.id} - {patient.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Medication Details */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Medication Plan
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medication
                </label>
                <select
                  className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  value={formData.drug_id}
                  onChange={(e) =>
                    setFormData({ ...formData, drug_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Medication</option>
                  {drugTypes.map((drug) => (
                    <option key={drug.id} value={drug.id}>
                      {drug.drug_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dosage
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    value={formData.dosage}
                    onChange={(e) =>
                      setFormData({ ...formData, dosage: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit
                  </label>
                  <select
                    className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    value={formData.dosage_unit}
                    onChange={(e) =>
                      setFormData({ ...formData, dosage_unit: e.target.value })
                    }
                  >
                    <option value="mg">mg</option>
                    <option value="ml">ml</option>
                    <option value="unit">units</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Timing Information */}
          <div className="pb-4">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Administration Schedule
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time of Day
                </label>
                <select
                  className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  value={formData.time_of_reading}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      time_of_reading: e.target.value,
                    })
                  }
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="bedtime">Bedtime</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary dark:[&::-webkit-calendar-picker-indicator]:invert"
                  value={formData.recommendation_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recommendation_date: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-900 dark:bg-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-primary-dark transition-colors"
            >
              Create Recommendation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
