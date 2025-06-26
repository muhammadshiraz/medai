// lib/api/bloodSugarService.ts
import { apiClient } from "@/lib/api/apiClient";
import type { ApiResponse } from "@/lib/api/types";
import type { BloodSugarReading } from "@/types/bloodSugar";
//import { baseAPIClient } from "./baseAPIClient";

interface BloodSugarRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  columns: string[];
  sqltypes?: Record<string, number>;
  offset?: number;
  pageSize?: number;
  orderBy?: Array<{ columnName: string; ascendent: boolean }>;
}

export const BloodSugarService = {
  getBloodSugarReadings: async (
    page: number = 1,
    pageSize: number = 10,
    sortColumn?: string,
    sortDirection: "asc" | "desc" = "asc"
  ): Promise<{ data: BloodSugarReading[]; total: number }> => {
    const payload: BloodSugarRequest = {
      columns: [
        "id",
        "patient_id",
        "time_of_reading",
        "reading_value",
        "reading_date",
        "notes",
      ],
      sqltypes: {
        id: 4,
        reading_value: 8,
        patient_id: 4,
        notes: 12,
      },
      offset: (page - 1) * pageSize,
      pageSize,
      orderBy: sortColumn
        ? [{ columnName: sortColumn, ascendent: sortDirection === "asc" }]
        : [{ columnName: "id", ascendent: true }],
      filter: {},
    };

    const response = await apiClient
      .post<ApiResponse<BloodSugarReading[]>>(
        "/Reading/Reading"
        , payload
      )
      .catch((error) => {
        console.error("Blood Sugar Reading GET Error Details:", {
          url: error.config?.url,
          payload,
          status: error.response?.status,
          response: error.response?.data,
        });
        throw error;
      });

    if (response.data.code !== 0) {
      throw new Error("POST Blood Sugar Reading API Error " + response.data.code);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processedData = response.data.data.map((item: any) => ({
      ...item,
      reading_value: parseFloat(item.reading_value),
    }));

    const total =
      processedData.length >= pageSize
        ? page * pageSize + 1
        : (page - 1) * pageSize + processedData.length;

    return { data: processedData, total };
  },

  updateReading: async (id: number, reading: Partial<BloodSugarReading>): Promise<BloodSugarReading> => {
    const payload = {
      data: {
          patient_id: reading.patient_id,
          time_of_reading: reading.time_of_reading,
          reading_value: reading.reading_value,
          reading_date: reading.reading_date,
          notes: reading.notes ? reading.notes !== undefined : "",
        },
        filter: {id: id.toString()},
        sqltypes: {
          id: 4,
          time_of_reading: 12, // Assuming time is in ISO format
          reading_date: 93, // Assuming date is in ISO format
          reading_value: 8,
          patient_id: 4,
          notes: 12
        }

    };

    const response = await apiClient.patch<ApiResponse<BloodSugarReading>>(
      `/Reading/Reading`,
      payload
    );

    //if (response.data.code !== 0) throw new Error(response.data.message || "API Error");
    return response.data.data;
  },

  createReading: async (reading: Partial<BloodSugarReading>): Promise<BloodSugarReading> => {
    const payload = {
      data: reading,
      sqltypes: {id: 4,
        time_of_reading: 12,
        reading_date: 93, // Assuming date is in ISO format
        reading_value: 8,
        notes: 12 },
    };
    console.log("Creating Blood Sugar Reading:", JSON.stringify(payload));
    const response = await apiClient.post<ApiResponse<BloodSugarReading>>(
      "/Reading/Reading",
      payload
    );
    if (response.data.code !== 0) {
      throw new Error("Blood Sugar Reading POST API Error");
    }
    return response.data.data;
  },
};
