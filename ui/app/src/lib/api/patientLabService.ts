// src/lib/api/patientLabService.ts
import { apiClient } from "@/lib/api/apiClient";
import type { ApiResponse } from "@/lib/api/types";
import type { PatientLab } from "@/types/patientLab";

interface LabRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  columns: string[];
  sqltypes?: Record<string, number>;
  offset?: number;
  pageSize?: number;
  orderBy?: Array<{ columnName: string; ascendent: boolean }>;
}

export const PatientLabService = {
  getPatientLabs: async (
    page: number = 1,
    pageSize: number = 20,
    sortColumn?: string,
    sortDirection: "asc" | "desc" = "asc"
  ): Promise<{ data: PatientLab[]; total: number }> => {
    const payload: LabRequest = {
      filter: {},
      columns: [
        "id",
        "lab_name",
        "patient_id",
        "lab_test_name",
        "lab_test_code",
        "lab_test_description",
        "lab_date",
        "lab_result",
      ],
      sqltypes: { id: 4 },
      offset: (page - 1) * pageSize,
      pageSize,
      orderBy: sortColumn
        ? [{ columnName: sortColumn, ascendent: sortDirection === "asc" }]
        : [{ columnName: "lab_date", ascendent: false }],
    };

    const response = await apiClient
      .post<ApiResponse<PatientLab[]>>("/PatientLab/PatientLab", payload)
      .catch((error) => {
        console.error("Lab API Error:", {
          url: error.config?.url,
          payload,
          status: error.response?.status,
          response: error.response?.data,
        });
        throw error;
      });

    if (response.data.code !== 0) {
      throw new Error("Patient Lab GET API Error -" + response.data.message);
    }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processedData = response.data.data.map((item: any) => ({
      ...item,
      id: parseInt(item.id),
      patient_id: parseInt(item.patient_id),
    }));

    const total =
      processedData.length >= pageSize
        ? page * pageSize + 1
        : (page - 1) * pageSize + processedData.length;

    return { data: processedData, total };
  },

  
  createLab: async (lab: Omit<PatientLab, "id">) => {
    const payload = {
      data: lab,
      sqltypes: {}
    
    };
    const response = await apiClient.post<ApiResponse<PatientLab>>(
      "/PatientLab/PatientLab",
      payload
    );
    if (response.data.code !== 0) throw new Error("Patient Lab POST API Error - " + response.data.message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.data;
  },
};
