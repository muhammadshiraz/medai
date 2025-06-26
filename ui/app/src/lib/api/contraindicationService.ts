// src/lib/api/contraindicationService.ts
import { apiClient } from "@/lib/api/apiClient";
import type { ApiResponse } from "@/lib/api/types";
import type { Contraindication } from "@/types/contraindication";

interface ContraindicationRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  columns: string[];
  sqltypes?: Record<string, number>;
  offset?: number;
  pageSize?: number;
  orderBy?: Array<{ columnName: string; ascendent: boolean }>;
}

export const ContraindicationService = {
  getContraindications: async (
    page: number = 1,
    pageSize: number = 20,
    sortColumn?: string,
    sortDirection: "asc" | "desc" = "asc"
  ): Promise<{ data: Contraindication[]; total: number }> => {
    const payload: ContraindicationRequest = {
      filter: {},
      columns: [
        "id",
        "drug_id",
        "drug_name",
        "condition",
        "severity",
        "description",
        "recommendation",
      ],
      sqltypes: { id: 4, drug_id: 4 },
      offset: (page - 1) * pageSize,
      pageSize,
      orderBy: sortColumn
        ? [{ columnName: sortColumn, ascendent: sortDirection === "asc" }]
        : [{ columnName: "drug_name", ascendent: true }],
    };

    const response = await apiClient
      .post<ApiResponse<Contraindication[]>>(
        "/Contraindication/Contraindication/",
        payload
      )
      .catch((error) => {
        console.error("Contraindication API Error:", error);
        throw error;
      });

    if (response.data.code !== 0) throw new Error("API Error");

    const total =
      response.data.data.length >= pageSize
        ? page * pageSize + 1
        : (page - 1) * pageSize + response.data.data.length;

    return { data: response.data.data, total };
  },

  createContraindication: async (
    contraindication: Omit<Contraindication, "id">
  ) => {
    const response = await apiClient.post<ApiResponse<Contraindication>>(
      "/Contraindication/Contraindication/",
      contraindication
    );
    if (response.data.code !== 0) throw new Error("API Error");
    return response.data.data;
  },
};
