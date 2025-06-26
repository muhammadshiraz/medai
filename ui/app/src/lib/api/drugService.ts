// src/lib/api/drugService.ts
import { apiClient } from "@/lib/api/apiClient";
import type { ApiResponse } from "@/lib/api/types";
import type { Drug } from "@/types/drug";

interface DrugRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  columns: string[];
  sqltypes?: Record<string, number>;
  offset?: number;
  pageSize?: number;
  orderBy?: Array<{ columnName: string; ascendent: boolean }>;
}

export const DrugService = {
  getDrugs: async (
    page: number = 1,
    pageSize: number = 20,
    sortColumn?: string,
    sortDirection: "asc" | "desc" = "asc"
  ): Promise<{ data: Drug[]; total: number }> => {
    const payload: DrugRequest = {
      filter: {},
      columns: [
        "id",
        "drug_name",
        "dosage",
        "dosage_unit",
        "drug_type",
        "manufacturer",
        "side_effects",
      ],
      sqltypes: { id: 4, dosage: 8 },
      offset: (page - 1) * pageSize,
      pageSize,
      orderBy: sortColumn
        ? [{ columnName: sortColumn, ascendent: sortDirection === "asc" }]
        : [{ columnName: "drug_name", ascendent: true }],
    };

    const response = await apiClient
      .post<ApiResponse<Drug[]>>("/Drug/Drug/", payload)
      .catch((error) => {
        console.error("Drug API Error:", error);
        throw error;
      });

    if (response.data.code !== 0) throw new Error("API Error");

    const processedData = response.data.data.map((drug) => ({
      ...drug,
      dosage: parseFloat(drug.dosage.toString()),
    }));

    const total =
      response.data.data.length >= pageSize
        ? page * pageSize + 1
        : (page - 1) * pageSize + response.data.data.length;

    return { data: processedData, total };
  },

  createDrug: async (drug: Omit<Drug, "id">) => {
    const response = await apiClient.post<ApiResponse<Drug>>(
      "/Drug/Drug/",
      drug
    );
    if (response.data.code !== 0) throw new Error("API Error");
    return response.data.data;
  },
};
