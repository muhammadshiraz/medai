export interface PatientReadingHistory {
  id: number;
  patient_id: number;
  reading_date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  bedtime: number;
  notes_for_day: string | null;
}
