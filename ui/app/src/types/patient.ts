
export interface Patient {
  insulinData: InsulinData[];
  medications: Medications[];
  latestReadings: Reading[];
  recommendations: Recommendation[];
  id: number;
  name: string;
  birth_date: string;
  age: string; // Age can be undefined if birth_date is not available
  weight: number;
  height: number;
  hba1c: string;
  duration: number;
  patient_sex: "M" | "F";
  creatine_mg_dl: string;
  medical_record_number: string;
  created_date: string;
  ckd: 0 | 1;
  cad: 0 | 1;
  hld: 0 | 1;
}

export interface InsulinRule {
  blood_sugar_range: string;
  blood_sugar_level: number;
  glargine_before_dinner: number
  lispro_before_breakfast: number;
  lispro_before_lunch: number;
  lispro_before_dinner: number;
} 

export interface InsulinData {
  drug: string;
  breakfast : string;
  lunch: string;
  dinner: string;
  bedtime: string;
}
export interface Medications  {
  dinner: string;
  lunch: string;
  breakfast: string;
  drug: string;
  patient_id: number;
  drug_id: number;
  dosage: number;
  dosage_unit: string;
}

export interface Reading {
  id: number;   
  patient_id: number;
  time_of_reading: string;
  reading_value: number;
  reading_date: string;
  notes: string;
}

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