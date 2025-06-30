"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { usePageTitle } from "@/context/PageTitleContext";
import type { Patient } from "@/types/patient";
import { motion } from "framer-motion";
import {
  formatBirthDate,
  calculateAge,
  formatCreatinine,
  getReadingStatus,
} from "@/lib/utils";

import { PatientService } from "@/lib/api/patientService";

import { usePatients } from "@/hooks/usePatients";
import { useBloodSugarReadings } from "@/hooks/useBloodSugarReadings";
import { useRecommendations } from "@/hooks/useRecommendations";
import Select from "react-select";

export default function PatientDetail() {
  const { setTitle } = usePageTitle();
  const { patients } = usePatients();
  const { readings = [] } = useBloodSugarReadings(undefined, patients);
  const { recommendations, drugTypes } = useRecommendations();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // New const fields
  const [patientDetails, setPatientDetails] = useState<any>(undefined);
  const [latestReadings, setLatestReadings] = useState<any>(undefined);
  const [groupMedications, setGroupMedications] = useState<any>([]);
  const [groupInsulinData, setGroupInsulinData] = useState<any>([]);

  const options = patients.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  useEffect(() => {
    setTitle("Patients");
  }, []);

  const getLatestReadings = (id: number) => {
    if (!readings || !id) {
      return {};
    }

    // Explicitly type the Set as string
    const seenTimes = new Set<string>();

    const patientReadings = readings
      .filter((reading) => reading.patient_id === Number(id))
      .sort(
        (a, b) =>
          new Date(b.reading_date).getTime() -
          new Date(a.reading_date).getTime()
      );

    const latestReadings: Record<string, string> = {};

    patientReadings.forEach((reading) => {
      // Convert numeric time_of_reading to string
      const timeKey = reading.time_of_reading.toString();

      if (!seenTimes.has(timeKey)) {
        // Parse the string value from API to number, then format
        latestReadings[timeKey] = Number(reading.reading_value).toFixed(0);
        seenTimes.add(timeKey);
      }
    });

    return latestReadings;
  };

  const getMedicationData = (id: number) => {
    if (!recommendations || !drugTypes || !id) {
      return [];
    }

    const drugMap = new Map(drugTypes.map((drug) => [drug.id, drug.drug_name]));

    return recommendations
      .filter(
        (rec) => rec.patient_id === Number(id) && drugMap.has(rec.drug_id)
      )
      .map((rec) => ({
        drugName: drugMap.get(rec.drug_id) || "Unknown Drug",
        // Convert dosage to number first if it's a string
        dosage: `${Number(rec.dosage).toFixed(0)} ${rec.dosage_unit}`,
        time: rec.time_of_reading as "breakfast" | "lunch" | "dinner", // Add type assertion
      }));
  };

  const getInsulinData = (id: number) => {
    if (!recommendations || !drugTypes || !id) {
      return [];
    }

    const drugMap = new Map(drugTypes.map((drug) => [drug.id, drug.drug_name]));
    const insulinDrugs = ["Glargine", "Lispro"];

    return recommendations
      .filter((rec) => {
        const drugName = drugMap.get(rec.drug_id) || "";
        return rec.patient_id === Number(id) && insulinDrugs.includes(drugName);
      })
      .map((rec) => ({
        drugName: drugMap.get(rec.drug_id) || "Unknown Insulin",
        dosage: `${Number(rec.dosage).toFixed(0)} ${rec.dosage_unit}`,
        time: rec.time_of_reading as
          | "breakfast"
          | "lunch"
          | "dinner"
          | "bedtime",
      }));
  };

  const onPatientSearch = async (value: any) => {
    try {
      console.log(value);
      setLoading(true);
      const dataData = await PatientService.getPatientById(value.value);
      setPatient(dataData);

      const patientNewDetails = dataData
        ? {
            heightInMeters: dataData.height / 100,
            bmi:
              dataData.weight && dataData.height
                ? (dataData.weight / (dataData.height / 100) ** 2).toFixed(1)
                : "-",
            formattedBirthDate: formatBirthDate(dataData.birth_date),
          }
        : null;
      setPatientDetails(patientNewDetails);

      const latestNewReadings = getLatestReadings(value.value);
      setLatestReadings(latestNewReadings);

      const groupNewMedications = () => {
        const medications = getMedicationData(value.value);
        const grouped: Record<
          string,
          {
            breakfast?: string;
            lunch?: string;
            dinner?: string;
            [key: string]: string | undefined; // Add index signature
          }
        > = {};

        medications.forEach((med) => {
          if (!grouped[med.drugName]) {
            grouped[med.drugName] = {};
          }
          // Now TypeScript knows we can use string index
          grouped[med.drugName][med.time] = med.dosage;
        });

        return Object.entries(grouped).map(([drug, times]) => ({
          drug,
          breakfast: times.breakfast || "-",
          lunch: times.lunch || "-",
          dinner: times.dinner || "-",
        }));
      };
      setGroupMedications(groupNewMedications);

      const groupInsulinData = () => {
        const insulinMeds = getInsulinData(value.value);
        const grouped: Record<
          string,
          {
            breakfast?: string;
            lunch?: string;
            dinner?: string;
            bedtime?: string;
            [key: string]: string | undefined;
          }
        > = {};

        insulinMeds.forEach((med) => {
          if (!grouped[med.drugName]) {
            grouped[med.drugName] = {};
          }
          grouped[med.drugName][med.time] = med.dosage;
        });

        return Object.entries(grouped).map(([drug, times]) => ({
          drug,
          breakfast: times.breakfast || "-",
          lunch: times.lunch || "-",
          dinner: times.dinner || "-",
          bedtime: times.bedtime || "-",
        }));
      };
      setGroupInsulinData(groupInsulinData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(true);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <div className="flex justify-between items-center">
            <ul className="flex space-x-2">
              <li>
                <Link href="/patient" className="hover:underline text-blue-600">
                  Dashboard
                </Link>
                <span className="mx-1">/</span>
              </li>
              <li className="font-medium text-gray-900 dark:text-gray-400">
                Patients
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Select
                className="w-[250px]"
                options={options}
                onChange={onPatientSearch}
              />
              <Link
                href={patient ? `/patient/${patient?.id}/edit` : ""}
                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${
                  patient
                    ? "from-blue-500 to-blue-600 hover:shadow-xl transition-all duration-300 hover:scale-105"
                    : "from-gray-500 to-gray-600 cursor-default"
                } text-white rounded-lg shadow-lg group`}
              >
                <svg
                  className="w-5 h-5 group-hover:rotate-12 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span>Edit Patient</span>
              </Link>

              <Link
                href="/patient/create"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <svg
                  className="w-5 h-5 group-hover:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>New Patient</span>
              </Link>
            </div>
          </div>
        </nav>

        {loading ? (
          <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 absolute left-0 right-0 top-0 bottom-0 z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 border-4 border-medical-primary border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <>
            {/* Patient Header */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
              {/* Left Box: Patient Image & Name */}
              <div className="col-span-1 flex flex-col items-center text-center md:border-r md:border-gray-300 md:pr-6 justify-center h-full">
                <div className="mb-4">
                  <img
                    src={
                      patient
                        ? patient.patient_sex === "F"
                          ? "/patient-details/female.svg"
                          : "/patient-details/male.svg"
                        : ""
                    }
                    alt={
                      patient
                        ? patient.patient_sex === "F"
                          ? "Female"
                          : "Male"
                        : "-"
                    }
                    className="w-32 h-32 rounded-full border-4 border-blue-200 shadow-md object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-400">
                    {patient?.name || "-"}
                  </h1>
                  <p className="text-gray-500 text-base mt-1">
                    sample@email.com
                  </p>
                </div>
              </div>

              {/* Right Box: Doctor Info & Patient Metadata */}
              <div className="col-span-3 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <InfoItem label="Name" value={patient?.name || "-"} />
                  <InfoItem
                    label="Birth Date"
                    value={patient ? formatBirthDate(patient.birth_date) : "-"}
                  />
                  <InfoItem
                    label="Age"
                    value={calculateAge(patient?.birth_date || "-") ?? "-"}
                  />

                  <InfoItem label="Weight" value={patient?.weight || "-"} />
                  <InfoItem label="Height" value={patient?.height || "-"} />
                  <InfoItem label="BMI" value={patientDetails?.bmi || "-"} />

                  <InfoItem label="HbA1c" value={patient?.hba1c || "-"} />
                  <InfoItem
                    label="Creatinine"
                    value={formatCreatinine(
                      parseFloat(patient?.creatine_mg_dl || ("-" as string))
                    )}
                  />
                  <InfoItem label="Duration" value={patient?.duration || "-"} />

                  <InfoItem label="CAD" value={patient?.cad || "-"} />
                  <InfoItem label="CKD" value={patient?.ckd || "-"} />
                  <InfoItem label="HLD" value={patient?.hld || "-"} />
                </div>
              </div>
            </div>

            {/* Current Vitals */}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold mb-4">
                BloodSugars/Fingerstick
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <VitalItem
                  label="Before Breakfast"
                  value={latestReadings?.breakfast || "-"}
                  sub="mg/dL"
                  status={
                    latestReadings
                      ? latestReadings.breakfast
                        ? getReadingStatus(parseFloat(latestReadings.breakfast))
                        : "normal"
                      : "normal"
                  }
                />
                <VitalItem
                  label="Before Lunch"
                  value={latestReadings?.lunch || "-"}
                  sub="mg/dl"
                  status={
                    latestReadings
                      ? latestReadings.lunch
                        ? getReadingStatus(parseFloat(latestReadings.lunch))
                        : "normal"
                      : "normal"
                  }
                />
                <VitalItem
                  label="Before Dinner"
                  value={latestReadings?.dinner || "-"}
                  sub="mg/dl"
                  status={
                    latestReadings
                      ? latestReadings.dinner
                        ? getReadingStatus(parseFloat(latestReadings.dinner))
                        : "normal"
                      : "normal"
                  }
                />
                <VitalItem
                  label="Before Bedtime"
                  value={latestReadings?.bedtime || "-"}
                  sub="mg/dl"
                  status={
                    latestReadings
                      ? latestReadings.bedtime
                        ? getReadingStatus(parseFloat(latestReadings.bedtime))
                        : "normal"
                      : "normal"
                  }
                />
              </div>
            </div>

            {/* Patient Recommendations / Medications */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Recommendations / Medications
                </h2>
                <span className="text-gray-600 dark:text-gray-400">
                  Total {patient?.name || "-"} Visits
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600 dark:text-gray-400 border-b">
                      <th className="pb-3">DOSE/mg</th>
                      <th className="pb-3">BreakFast</th>
                      <th className="pb-3">Lunch</th>
                      <th className="pb-3">Dinner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupMedications.map((medication, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 font-medium">{medication.drug}</td>
                        <td>{medication.breakfast}</td>
                        <td>{medication.lunch}</td>
                        <td>{medication.dinner}</td>
                      </tr>
                    ))}
                    {groupMedications.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="pt-8 pb-4 text-center text-gray-500"
                        >
                          No medications found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insulin Section */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mt-8">
              <h2 className="text-xl font-semibold mb-4">Insulin</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600 dark:text-gray-400 border-b">
                      <th className="pb-3">Units</th>
                      <th className="pb-3">Before BreakFast</th>
                      <th className="pb-3">Before Lunch</th>
                      <th className="pb-3">Before Dinner</th>
                      <th className="pb-3">Before Bed Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupInsulinData.map((insulin, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 font-medium">{insulin.drug}</td>
                        <td>{insulin.breakfast}</td>
                        <td>{insulin.lunch}</td>
                        <td>{insulin.dinner}</td>
                        <td>{insulin.bedtime}</td>
                      </tr>
                    ))}
                    {groupInsulinData.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="pt-8 pb-4 text-center text-gray-500"
                        >
                          No insulin recommendations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nutrition & Exercise Section */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Nutrition & Exercise
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600 dark:text-gray-400 border-b">
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Recommendation</th>
                    </tr>
                  </thead>
                  {/* <tbody>
                <tr className="border-b">
                  <td className="py-4 font-medium">Diet</td>
                  <td>Less Starches/Carbohydrate</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Exercise</td>
                  <td>7000 Steps Daily</td>
                </tr>
              </tbody> */}
                  <tbody>
                    <tr>
                      <td
                        colSpan={5}
                        className="pt-8 pb-4 text-center text-gray-500"
                      >
                        No nutrition and exercise recommendations found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}

// Info display components
const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="flex flex-col justify-between items-start py-2 gap-y-2">
    <span className="text-gray-900 font-semibold text-lg">{label}</span>
    <span className="font-medium text-gray-600 dark:text-gray-400 text-base">
      {value !== undefined && value !== null ? value : "-"}
    </span>
  </div>
);

const VitalItem = ({
  label,
  value,
  sub,
  status,
}: {
  label: string;
  value: string;
  sub: string;
  status: "normal" | "abnormal";
}) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
    <h3 className="text-black text-base mb-2">{label}</h3>
    <div className="mb-2 flex flex-row items-baseline">
      <span className="text-3xl font-semibold">{value}</span>
      <span className="text-gray-500 font-medium ml-1">{sub}</span>
    </div>
    <div className="flex justify-between items-center">
      <span
        className={`text-sm ${
          status === "normal" ? "text-green-600" : "text-red-600"
        }`}
      >
        {status === "normal" ? "in the norm" : "Above the norm"}
      </span>
    </div>
  </div>
);
