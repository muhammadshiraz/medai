// src/components/Drug/AddDrugModal.tsx
import { Drug } from "@/types/drug";
import { useState } from "react";

interface AddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (drug: Omit<Drug, "id">) => void;
}

export const AddDrugModal = ({
  isOpen,
  onClose,
  onSave,
}: AddDrugModalProps) => {  
  const [formData, setFormData] = useState<Omit<Drug, "id">>({
    drug_name: "",
    dosage: 0,
    dosage_unit: "mg",
    drug_type: "Oral",
    manufacturer: "",
    side_effects: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      dosage: Number(formData.dosage),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-gray-600 dark:bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">New Drug</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Drug Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={formData.drug_name}
                onChange={(e) =>
                  setFormData({ ...formData, drug_name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dosage</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={formData.dosage}
                onChange={(e) =>
                  setFormData({ ...formData, dosage: Number(e.target.value) })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dosage Unit
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
                <option value="g">g</option>
                <option value="units">units</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Drug Type
              </label>
              <select
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={formData.drug_type}
                onChange={(e) =>
                  setFormData({ ...formData, drug_type: e.target.value })
                }
              >
                <option value="Oral">Oral</option>
                <option value="Injectable">Injectable</option>
                <option value="Topical">Topical</option>
                <option value="Inhalation">Inhalation</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manufacturer
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={formData.manufacturer}
                onChange={(e) =>
                  setFormData({ ...formData, manufacturer: e.target.value })
                }
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Side Effects
              </label>
              <textarea
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={formData.side_effects || ""}
                onChange={(e) =>
                  setFormData({ ...formData, side_effects: e.target.value })
                }
                rows={3}
              />
            </div>
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
              Create Drug
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
