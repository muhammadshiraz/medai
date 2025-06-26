// src/types/recommendation.ts
export interface Recommendation {
  id: number;
  patient_id: number;
  drug_id: number;
  dosage: number;
  dosage_unit: string;
  time_of_reading: string;
  recommendation_date: string;
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
