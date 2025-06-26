// hooks/usePatients.ts
import { useState, useEffect, useMemo } from "react";
import { PatientService } from "@/lib/api/patientService";
import type { Patient } from "@/types/patient";

export const usePatients = (searchQuery = "") => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await PatientService.getAllPatients();
        setPatients(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch patients"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = useMemo(
    () =>
      patients.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.medical_record_number
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      ),
    [patients, searchQuery]
  );

  return {
    patients: filteredPatients,
    loading,
    error,
  };
};
