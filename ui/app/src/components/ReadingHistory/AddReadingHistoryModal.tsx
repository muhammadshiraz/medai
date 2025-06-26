// src/components/ReadingHistory/AddHistoryModal.tsx
import { useState } from "react";
import type { PatientReadingHistory } from "@/types/patientReadingHistory";
import { usePatients } from "@/hooks/usePatients";
interface AddHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (history: Omit<PatientReadingHistory, "id">) => void;
}

export function AddHistoryModal({
  isOpen,
  onClose,
  onSave,
}: AddHistoryModalProps) {
  const { patients } = usePatients();
  const [formData, setFormData] = useState<Omit<PatientReadingHistory, "id">>({
    patient_id: 0,
    reading_date: new Date().toISOString().split("T")[0],
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    bedtime: 0,
    notes_for_day: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      patient_id: 0,
      reading_date: new Date().toISOString().split("T")[0],
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      bedtime: 0,
      notes_for_day: null,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
  
    try {
      // Validate date format
      const dateObj = new Date(formData.reading_date);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Please select a valid date");
      }
  
      // Validate future dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dateObj > today) {
        throw new Error("Cannot create readings for future dates");
      }
  
      await onSave(formData);
      resetForm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save reading history"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-gray-600 dark:bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 dark:text-gray-300">
          Add Daily Reading History
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Patient ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Patient ID *
              </label>
              <select
                required
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={formData.patient_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    patient_id: Number(e.target.value),
                  })
                }
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Meal Readings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Breakfast (mg/dL) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="500"
                  className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  value={formData.breakfast}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      breakfast: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lunch (mg/dL) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="500"
                  className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  value={formData.lunch}
                  onChange={(e) =>
                    setFormData({ ...formData, lunch: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dinner (mg/dL) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="500"
                  className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  value={formData.dinner}
                  onChange={(e) =>
                    setFormData({ ...formData, dinner: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bedtime (mg/dL) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="500"
                  className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  value={formData.bedtime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bedtime: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Reading Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary dark:[&::-webkit-calendar-picker-indicator]:invert"
                value={formData.reading_date}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData({ ...formData, reading_date: e.target.value })
                }
              />
            </div>

            {/* Daily Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Daily Notes
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={formData.notes_for_day || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notes_for_day: e.target.value || null,
                  })
                }
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-900 dark:bg-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-primary-dark transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? <>Saving...</> : "Save Reading"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
