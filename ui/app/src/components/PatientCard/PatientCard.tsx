import Link from "next/link";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  CalendarIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import MetricItem from "@/components/MetricItem/MetricItem";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PatientCard({ patient }: { patient: any }) {
  const lastVisit = new Date(patient.created_date).toLocaleDateString();
  const bmi = (
    (patient.weight * 0.453592) /
    (patient.height * 0.0254) ** 2
  ).toFixed(1);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100"
    >
      <Link href={`/patient/${patient.id}`} className="block p-6">
        {/* Status Indicator */}
        <div className="absolute top-4 right-4">
          <div
            className={`w-3 h-3 rounded-full ${
              patient.active ? "bg-green-400" : "bg-gray-300"
            }`}
          />
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medical-primary to-blue-400 flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {patient.name[0]}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-400 group-hover:text-medical-primary transition-colors">
              {patient.name}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <DocumentTextIcon className="w-4 h-4" />
                <span>{patient.medical_record_number}</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <ScaleIcon className="w-4 h-4" />
                <span>BMI: {bmi}</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <CalendarIcon className="w-4 h-4" />
                <span>{patient.age}yrs</span>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm ${
                    patient.patient_sex === "M"
                      ? "text-blue-600"
                      : "text-pink-600"
                  }`}
                >
                  {patient.patient_sex === "M" ? "♂" : "♀"}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {patient.patient_sex === "M" ? "Male" : "Female"}
                </span>
              </div>
            </div>

            {/* Condition Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {patient.ckd && (
                <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                  Chronic Kidney Disease
                </span>
              )}
              {patient.cad && (
                <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                  Coronary Artery Disease
                </span>
              )}
              {patient.hld && (
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                  Hyperlipidemia
                </span>
              )}
            </div>

            {/* Key Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MetricItem
                label="HbA1c"
                value={patient.hba1c}
                unit="%"
                status={parseFloat(patient.hba1c) > 6.5 ? "high" : "normal"}
              />
              <MetricItem
                label="Last Visit"
                value={lastVisit}
                status="neutral"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
