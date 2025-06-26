// src/lib/api/drugUnitService.ts
import { apiClient } from "@/lib/api/apiClient";
import type { ApiResponse } from "@/lib/api/types";
import type { DrugUnit } from "@/types/drugUnit";

interface DrugUnitRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  columns: string[];
  sqltypes?: Record<string, number>;
  offset?: number;
  pageSize?: number;
  orderBy?: Array<{ columnName: string; ascendent: boolean }>;
}

export const DrugUnitService = {
  getDrugUnits: async (
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ data: DrugUnit[]; total: number }> => {
    const payload: DrugUnitRequest = {
      filter: {},
      columns: ["unit_name"],
      sqltypes: {},
      offset: (page - 1) * pageSize,
      pageSize,
      orderBy: [{ columnName: "unit_name", ascendent: true }],
    };

    const response = await apiClient
      .post<ApiResponse<DrugUnit[]>>("/DrugUnit/DrugUnit/", payload)
      .catch((error) => {
        console.error("DrugUnit API Error:", error);
        throw error;
      });

    if (response.data.code !== 0) throw new Error("API Error");

    const total =
      response.data.data.length >= pageSize
        ? page * pageSize + 1
        : (page - 1) * pageSize + response.data.data.length;

    return { data: response.data.data, total };
  },

  createDrugUnit: async (unit: DrugUnit) => {
    const response = await apiClient.post<ApiResponse<DrugUnit>>(
      "/DrugUnit/DrugUnit/",
      unit
    );
    if (response.data.code !== 0) throw new Error("API Error");
    return response.data.data;
  },
};
