// src/types/contraindication.ts
export interface Contraindication {
  id: number;
  drug_id: number;
  drug_name: string;
  condition: string;
  severity: string;
  description: string;
  recommendation: string;
}
