// src/lib/api/insulinRuleService.ts
import { apiClient } from "@/lib/api/apiClient";
import type { ApiResponse } from "@/lib/api/types";
import type { InsulinRule } from "@/types/insulinRule";

interface InsulinRuleRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  columns: string[];
  sqltypes?: Record<string, number>;
  offset?: number;
  pageSize?: number;
  orderBy?: Array<{ columnName: string; ascendent: boolean }>;
}

export const InsulinRuleService = {
  getInsulinRules: async (
    page: number = 1,
    pageSize: number = 20,
    sortColumn?: string,
    sortDirection: "asc" | "desc" = "asc"
  ): Promise<{ data: InsulinRule[]; total: number }> => {
    const payload: InsulinRuleRequest = {
      filter: {},
      columns: [
        "id",
        "blood_sugar_reading",
        "blood_sugar_level",
        "glargine_before_dinner",
        "lispro_before_breakfast",
        "lispro_before_lunch",
        "lispro_before_dinner",
      ],
      sqltypes: {
        id: 4,
        blood_sugar_level: 4,
        glargine_before_dinner: 4,
        lispro_before_breakfast: 4,
        lispro_before_lunch: 4,
        lispro_before_dinner: 4,
      },
      offset: (page - 1) * pageSize,
      pageSize,
      orderBy: sortColumn
        ? [{ columnName: sortColumn, ascendent: sortDirection === "asc" }]
        : [{ columnName: "id", ascendent: true }],
    };

    const response = await apiClient
      .post<ApiResponse<InsulinRule[]>>("/InsulinRule/InsulinRule/", payload)
      .catch((error) => {
        console.error("Insulin Rule API Error:", error);
        throw error;
      });

    if (response.data.code !== 0) throw new Error("API Error");

    const total =
      response.data.data.length >= pageSize
        ? page * pageSize + 1
        : (page - 1) * pageSize + response.data.data.length;

    return { data: response.data.data, total };
  },

  createInsulinRule: async (rule: Omit<InsulinRule, "id">) => {
    const response = await apiClient.post<ApiResponse<InsulinRule>>(
      "/InsulinRule/InsulinRule/",
      rule
    );
    if (response.data.code !== 0) throw new Error("API Error");
    return response.data.data;
  },
};
