// src/types/drug.ts
export interface Drug {
  id: number;
  drug_name: string;
  dosage: number;
  dosage_unit: string;
  drug_type: string;
  manufacturer: string;
  side_effects: string | null;
}
