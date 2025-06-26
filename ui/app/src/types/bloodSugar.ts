// src/types/bloodSugar.ts
export interface BloodSugarReading {
  id: number;
  patient_id: number;
  time_of_reading: string;
  reading_value: number;
  reading_date: string;
  notes: string;
}