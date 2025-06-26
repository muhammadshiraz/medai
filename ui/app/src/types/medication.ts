// src/types/medication.ts
export interface Medication {
  id: number;
  patient_id: number;
  drug_id: number;
  dosage: number;
  dosage_unit: string;
  drug_name?: string;
}

export interface PatientType {
  id: number;
  name: string;
}

export interface DrugType {
  id: number;
  drug_name: string;
}
