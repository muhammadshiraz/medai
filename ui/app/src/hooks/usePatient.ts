import { useState, useEffect } from "react";
import { PatientService } from "@/lib/api/patientService";
import type { Patient } from "@/types/patient";

export const usePatient = (id: number) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        console.log('Fetching patient with ID:', id);
        setLoading(true);
        const data = await PatientService.getPatientById(id);
        
        if (!data) {
          throw new Error('Patient data is empty');
        }
        
        setPatient(data);
        setError(null);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err instanceof Error ? err.message : "Failed to fetch patient");
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    if (id && !isNaN(id)) {
      fetchPatient();
    }
  }, [id]);

  return { patient, loading, error };
};