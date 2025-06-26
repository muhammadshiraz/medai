// src/components/DrugUnit/AddDrugUnitModal.tsx
import { useState } from "react";

interface AddDrugUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (unit: { unit_name: string }) => void;
}

export const AddDrugUnitModal = ({
  isOpen,
  onClose,
  onSave,
}: AddDrugUnitModalProps) => {
  const [unitName, setUnitName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ unit_name: unitName });
    setUnitName("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-gray-600 dark:bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">New Drug Unit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              required
              autoFocus
            />
          </div>

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
              className="px-6 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-primary-dark"
            >
              Create Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
