// src/types/insulinRule.ts
export interface InsulinRule {
  id: number;
  blood_sugar_reading: string;
  blood_sugar_level: number;
  glargine_before_dinner: number | null;
  lispro_before_breakfast: number | null;
  lispro_before_lunch: number | null;
  lispro_before_dinner: number | null;
}
