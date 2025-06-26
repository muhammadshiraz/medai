import { useState } from "react";
import type { Contraindication } from "@/types/contraindication";

interface AddContraindicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contra: Omit<Contraindication, "id">) => void;
}

export const AddContraindicationModal = ({
  isOpen,
  onClose,
  onSave,
}: AddContraindicationModalProps) => {
  const [formData, setFormData] = useState<Omit<Contraindication, "id">>({
    drug_id: 0,
    drug_name: "",
    condition: "",
    severity: "Moderate",
    description: "",
    recommendation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      drug_id: Number(formData.drug_id),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-gray-600 dark:bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">New Contraindication</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Drug ID</label>
              <input
                type="number"
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={formData.drug_id}
                onChange={(e) =>
                  setFormData({ ...formData, drug_id: Number(e.target.value) })
                }
                required
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Condition
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Severity</label>
              <select
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value })
                }
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recommendation
              </label>
              <textarea
                className="w-full px-3 py-2 dark:bg-gray-900 dark:text-gray-300 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                value={formData.recommendation}
                onChange={(e) =>
                  setFormData({ ...formData, recommendation: e.target.value })
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
              Create Contraindication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
