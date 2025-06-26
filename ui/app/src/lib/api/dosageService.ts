// src/lib/api/dosageService.ts
import { apiClient } from "@/lib/api/apiClient";
import type { ApiResponse } from "@/lib/api/types";
import type { Dosage } from "@/types/dosage";

interface DosageRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  columns: string[];
  sqltypes?: Record<string, number>;
  offset?: number;
  pageSize?: number;
  orderBy?: Array<{ columnName: string; ascendent: boolean }>;
}

export const DosageService = {
  getDosages: async (
    page: number = 1,
    pageSize: number = 20,
    sortColumn?: string,
    sortDirection: "asc" | "desc" = "asc"
  ): Promise<{ data: Dosage[]; total: number }> => {
    const payload: DosageRequest = {
      filter: {},
      columns: [
        "id",
        "drug_id",
        "drug_name",
        "dosage_unit",
        "drug_type",
        "min_dose",
        "max_dose",
        "min_age",
        "max_age",
        "min_weight",
        "max_weight",
        "min_creatine",
        "max_creatine",
      ],
      sqltypes: {
        id: 4,
        min_dose: 8,
        max_dose: 8,
        min_age: 8,
        max_age: 8,
        min_weight: 8,
        max_weight: 8,
        min_creatine: 8,
        max_creatine: 8,
      },
      offset: (page - 1) * pageSize,
      pageSize,
      orderBy: sortColumn
        ? [{ columnName: sortColumn, ascendent: sortDirection === "asc" }]
        : [{ columnName: "drug_name", ascendent: true }],
    };

    const response = await apiClient
      .post<ApiResponse<Dosage[]>>("/Dosage/Dosage/", payload)
      .catch((error) => {
        console.error("Dosage API Error:", error);
        throw error;
      });

    if (response.data.code !== 0) throw new Error("API Error");

    const processData = (data: Dosage[]) =>
      data.map((dosage) => ({
        ...dosage,
        min_dose: dosage.min_dose
          ? parseFloat(dosage.min_dose.toString())
          : null,
        max_dose: dosage.max_dose
          ? parseFloat(dosage.max_dose.toString())
          : null,
        min_age: dosage.min_age ? parseFloat(dosage.min_age.toString()) : null,
        max_age: dosage.max_age ? parseFloat(dosage.max_age.toString()) : null,
        min_weight: dosage.min_weight
          ? parseFloat(dosage.min_weight.toString())
          : null,
        max_weight: dosage.max_weight
          ? parseFloat(dosage.max_weight.toString())
          : null,
        min_creatine: dosage.min_creatine
          ? parseFloat(dosage.min_creatine.toString())
          : null,
        max_creatine: dosage.max_creatine
          ? parseFloat(dosage.max_creatine.toString())
          : null,
      }));

    const total =
      response.data.data.length >= pageSize
        ? page * pageSize + 1
        : (page - 1) * pageSize + response.data.data.length;

    return { data: processData(response.data.data), total };
  },

  createDosage: async (dosage: Omit<Dosage, "id">) => {
    const response = await apiClient.post<ApiResponse<Dosage>>(
      "/Dosage/Dosage/",
      dosage
    );
    if (response.data.code !== 0) throw new Error("API Error");
    return response.data.data;
  },
};
