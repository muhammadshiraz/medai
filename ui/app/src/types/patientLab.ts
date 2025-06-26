// src/types/patientLab.ts
export interface PatientLab {
  id: number;
  patient_id: number;
  lab_name: string;
  lab_test_name: string;
  lab_test_code: string;
  lab_test_description: string;
  lab_date: string;
  lab_result: string;
}