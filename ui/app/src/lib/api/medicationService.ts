// src/lib/api/medicationService.tsPatientType
import { apiClient } from "@/lib/api/apiClient";
import type { ApiResponse } from "@/lib/api/types";
import type { Medication, PatientType, DrugType } from "@/types/medication";

interface MedicationRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  columns: string[];
  sqltypes?: Record<string, number>;
  offset?: number;
  pageSize?: number;
  orderBy?: Array<{ columnName: string; ascendent: boolean }>;
}

export const MedicationService = {
  getMedications: async (
    page: number = 1,
    pageSize: number = 20,
    sortColumn?: string,
    sortDirection: "asc" | "desc" = "asc"
  ): Promise<{ data: Medication[]; total: number }> => {
    const payload: MedicationRequest = {
      filter: {},
      columns: ["id", "dosage_unit", "drug_id", "patient_id", "dosage"],
      sqltypes: { id: 4, dosage: 8 },
      offset: (page - 1) * pageSize,
      pageSize,
      orderBy: sortColumn
        ? [{ columnName: sortColumn, ascendent: sortDirection === "asc" }]
        : [{ columnName: "id", ascendent: true }],
    };

    const response = await apiClient
      .post<ApiResponse<Medication[]>>(
        "/PatientMedication/PatientMedication",
        payload
      )
      .catch((error) => {
        console.error("Medication API Error:", error);
        throw error;
      });

    if (response.data.code !== 0) {
      throw new Error("Get Medications API Error = " + response.data.message);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processedData = response.data.data.map((item: any) => ({
      ...item,
      dosage: parseFloat(item.dosage),
    }));

    const total =
      processedData.length >= pageSize
        ? page * pageSize + 1
        : (page - 1) * pageSize + processedData.length;

    return { data: processedData, total };
  },

  getPatientTypes: async (): Promise<PatientType[]> => {
    const payload = {
      filter: {},
      columns: ["id", "name"],
      sqltypes: {},
    };

    const response = await apiClient.post<ApiResponse<PatientType[]>>(
      "/Patient/PatientType",
      payload
    );

    return response.data.data;
  },

  getDrugTypes: async (): Promise<DrugType[]> => {
    const payload = {
      filter: {},
      columns: ["id", "drug_name"],
      sqltypes: {},
    };

    const response = await apiClient.post<ApiResponse<DrugType[]>>(
      "/Drug/DrugType",
      payload
    );

    if (response.data.code !== 0) {
      throw new Error("Get Drugs API Error = " + response.data.message);
    }
    return response.data.data;
  },

  createMedication: async (medication: Omit<Medication, "id">) => {
    const payload = {
      data: medication,
      sqltypes: {
        id: 4,
        dosage_unit: 12,
        drug_id: 4,
        patient_id: 4,
        dosage: 8,
      },
    }
    const response = await apiClient.post<ApiResponse<Medication>>(
      "/PatientMedication/PatientMedication",
      payload
    );
    if (response.data.code !== 0) {
      throw new Error("Post Medications API Error = " + response.data.message);
    }
    return response.data.data;
  },
};
