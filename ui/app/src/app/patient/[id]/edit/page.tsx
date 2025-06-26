// app/patient/[id]/edit/page.tsx
"use client";
import { useEffect } from "react";
import PatientForm from "@/components/PatientForm";
import { usePatient } from "@/hooks/usePatient";
import { useBloodSugarReadings } from "@/hooks/useBloodSugarReadings";
import { useRecommendations } from "@/hooks/useRecommendations";
import { usePatients } from "@/hooks/usePatients";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";
import { usePageTitle } from "@/context/PageTitleContext";
import { useParams } from "next/navigation";

export default function EditPatient() {
  const { id } = useParams(); // Get ID from route parameters
  const numericId = Number(id);

  // Replicate EXACT PatientDetail data fetching pattern
  const { patients } = usePatients();
  const { readings = [] } = useBloodSugarReadings(undefined, patients);
  const { recommendations, drugTypes } = useRecommendations();
  const { patient, loading, error } = usePatient(numericId);

  const { setTitle } = usePageTitle();

  // 1:1 COPY from PatientDetail -------------------------------------------
  const getLatestReadings = () => {
    if (!readings || !numericId) {
      return [];
    }
    const seenTimes = new Set<string>();

    return readings
      .filter((reading) => reading.patient_id === numericId)
      .sort(
        (a, b) =>
          new Date(b.reading_date).getTime() -
          new Date(a.reading_date).getTime()
      )
      .filter((reading) => {
        const timeKey = reading.time_of_reading;
        if (!seenTimes.has(timeKey)) {
          seenTimes.add(timeKey);
          return true;
        }
        return false;
      })
      .map((reading) => ({
        id: reading.id,
        time_of_reading: reading.time_of_reading,
        reading_value: reading.reading_value,
        reading_date: reading.reading_date,
      }));
  };

  const getMedicationData = () => {
    if (!recommendations || !drugTypes || !id) {
      return [];
    }
    const numericId = Number(id);
    const drugMap = new Map(drugTypes.map((drug) => [drug.id, drug.drug_name]));
    return recommendations
      .filter((rec) => rec.patient_id === numericId && drugMap.has(rec.drug_id))
      .map((rec) => ({
        drugName: drugMap.get(rec.drug_id) || "Unknown Drug",
        dosage: `${Number(rec.dosage).toFixed(0)} ${rec.dosage_unit}`,
        time: rec.time_of_reading,
      }));
  };

  const groupMedications = () => {
    const medications = getMedicationData();
    const grouped: Record<string, Record<string, string>> = {};
    medications.forEach((med) => {
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
    }));
  };

  const getInsulinData = () => {
    if (!recommendations || !drugTypes || !id) {
      return [];
    }
    const numericId = Number(id);
    const drugMap = new Map(drugTypes.map((drug) => [drug.id, drug.drug_name]));
    const insulinDrugs = ["Glargine", "Lispro"];
    return recommendations
      .filter((rec) => {
        const drugName = drugMap.get(rec.drug_id) || "";
        return rec.patient_id === numericId && insulinDrugs.includes(drugName);
      })
      .map((rec) => ({
        drugName: drugMap.get(rec.drug_id) || "Unknown Insulin",
        dosage: `${Number(rec.dosage).toFixed(0)} ${rec.dosage_unit}`,
        time: rec.time_of_reading,
      }));
  };

  const groupInsulinData = () => {
    const insulinMeds = getInsulinData();
    const grouped: Record<string, Record<string, string>> = {};
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
  // END of 1:1 COPY ------------------------------------------------------

  useEffect(() => {
    if (patient) {
      setTitle(`Editing ${patient.name}`);
    }
  }, [patient, setTitle]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!patient) return <div className="p-6">Patient not found</div>;

  // Prepare IDENTICAL data structure as PatientDetail
  const formData = {
    ...patient,
    birth_date: patient?.birth_date
      ? new Date(patient.birth_date).toISOString().split("T")[0]
      : "",
    latestReadings: getLatestReadings(),
    medications: groupMedications(),
    insulinData: groupInsulinData(),
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">
        Edit Patient Profile
      </h1>
      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      <PatientForm initialData={formData as any} />
    </div>
  );
}
