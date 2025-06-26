// src/types/dosage.ts
export interface Dosage {
  id: number;
  drug_id: number;
  drug_name: string;
  dosage_unit: string;
  drug_type: string;
  min_dose: number | null;
  max_dose: number | null;
  min_age: number | null;
  max_age: number | null;
  min_weight: number | null;
  max_weight: number | null;
  min_creatine: number | null;
  max_creatine: number | null;
}
