// src/lib/api/recommendationService.ts
import { apiClient } from "@/lib/api/apiClient";
import type { ApiResponse } from "@/lib/api/types";
import type {
  Recommendation,
  PatientType,
  DrugType,
} from "@/types/recommendation";

interface RecommendationRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  columns: string[];
  sqltypes?: Record<string, number>;
  offset?: number;
  pageSize?: number;
  orderBy?: Array<{ columnName: string; ascendent: boolean }>;
}

export const RecommendationService = {
  getRecommendations: async (
    page: number = 1,
    pageSize: number = 20,
    sortColumn?: string,
    sortDirection: "asc" | "desc" = "asc"
  ): Promise<{ data: Recommendation[]; total: number }> => {
    const payload: RecommendationRequest = {
      filter: {},
      columns: [
        "id",
        "dosage_unit",
        "drug_id",
        "patient_id",
        "time_of_reading",
        "dosage",
        "recommendation_date",
      ],
      sqltypes: { id: 4, dosage: 8 },
      offset: (page - 1) * pageSize,
      pageSize,
      orderBy: sortColumn
        ? [{ columnName: sortColumn, ascendent: sortDirection === "asc" }]
        : [{ columnName: "recommendation_date", ascendent: false }],
    };

    const response = await apiClient
      .post<ApiResponse<Recommendation[]>>(
        "/Recommendation/Recommendation",
        payload
      )
      .catch((error) => {
        console.error("Recommendation API Error:", error);
        throw error;
      });

    if (response.data.code !== 0) {
      throw new Error("GET Recommendations API Error - " + response.data.message);
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
      sqltypes: { id: 4 },
    };

    const response = await apiClient.post<ApiResponse<DrugType[]>>(
      "/Drug/DrugType",
      payload
    );

    if (response.data.code !== 0) {
      throw new Error("GET DrugTypes API Error - " + response.data.message);
    }
    return response.data.data;
  },

  createRecommendation: async (recommendation: Omit<Recommendation, "id">) => {
    const payload = {
      data: recommendation,
      sqltypes: {
        id: 4,  
        dosage_unit: 12,
        drug_id: 4,
        patient_id: 4,
        time_of_reading: 12,
        dosage: 8,
        recommendation_date: 12,
      },
    };
    const response = await apiClient.post<ApiResponse<Recommendation>>(
      "/Recommendation/Recommendation",
      payload
    );
    if (response.data.code !== 0) {
      throw new Error("POST Recommendations API Error - " + response.data.message);
    }
    return response.data.data;
  },
};
