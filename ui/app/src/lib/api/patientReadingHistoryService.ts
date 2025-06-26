// lib/api/patientReadingHistoryService.ts
import { apiClient } from "@/lib/api/apiClient";
import type { ApiResponse } from "@/lib/api/types";
import type { PatientReadingHistory } from "@/types/patientReadingHistory";

interface PatientReadingHistoryRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  columns: string[];
  sqltypes?: Record<string, number>;
  offset?: number;
  pageSize?: number;
  orderBy?: Array<{ columnName: string; ascendent: boolean }>;
}

export const PatientReadingHistoryService = {
  getPatientReadingHistories: async (
    page: number = 1,
    pageSize: number = 10,
    sortColumn?: string,
    sortDirection: "asc" | "desc" = "asc"
  ): Promise<{ data: PatientReadingHistory[]; total: number }> => {
    const payload: PatientReadingHistoryRequest = {
      columns: [
        "id",
        "patient_id",
        "reading_date",
        "breakfast",
        "lunch",
        "dinner",
        "bedtime",
        "notes_for_day",
      ],
      sqltypes: {
        id: 4,
        patient_id: 4,
        breakfast: 8,
        lunch: 8,
        dinner: 8,
        bedtime: 8,
        notes_for_day: 12,
      },
      offset: (page - 1) * pageSize,
      pageSize,
      orderBy: sortColumn
        ? [{ columnName: sortColumn, ascendent: sortDirection === "asc" }]
        : [{ columnName: "reading_date", ascendent: false }], // Default sort by most recent dates
      filter: {},
    };

    const response = await apiClient
      .post<ApiResponse<PatientReadingHistory[]>>(
        "/ReadingHistory/ReadingHistory",
        payload
      )
      .catch((error) => {
        console.error("API Error Details:", {
          url: error.config?.url,
          payload,
          status: error.response?.status,
          response: error.response?.data,
        });
        throw error;
      });

    if (response.data.code !== 0) {
      throw new Error("API Error");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processedData = response.data.data.map((item: any) => ({
      ...item,
      // Parse numeric values if needed (assuming API returns strings)
      breakfast: parseFloat(item.breakfast),
      lunch: parseFloat(item.lunch),
      dinner: parseFloat(item.dinner),
      bedtime: parseFloat(item.bedtime),
    }));

    const total =
      processedData.length >= pageSize
        ? page * pageSize + 1
        : (page - 1) * pageSize + processedData.length;

    return { data: processedData, total };
  },

  updateReadingHistory: async (
    id: number,
    updates: Partial<PatientReadingHistory>
  ) => {
    if (updates.reading_date) {
      const date = new Date(updates.reading_date);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      // Store full ISO string
      updates.reading_date = date.toISOString();
    }

    let formattedDate = updates.reading_date;
    if (updates.reading_date) {
      const date = new Date(updates.reading_date);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      // Convert to Oracle DATE format (YYYY-MM-DD)
      formattedDate = date.toISOString().split("T")[0];
    }

    const payload = {
      filter: { id },
      data: { ...updates, reading_date: formattedDate },
      sqltypes: {
        id: 4,
        reading_date: 91,
        breakfast: 6,
        lunch: 6,
        dinner: 6,
        bedtime: 6,
        notes_for_day: 12,
      },
    };

    const response = await apiClient.put<ApiResponse<PatientReadingHistory>>(
      "/ReadingHistory/ReadingHistory",
      payload
    );

    if (response.data.code !== 0) {
      throw new Error("API Error");
    }
    return response.data.data;
  },

  createReadingHistory: async (reading: Omit<PatientReadingHistory, "id">) => {
    const inputDate = new Date(reading.reading_date);
    if (isNaN(inputDate.getTime())) {
      throw new Error("Invalid date format in request");
    }
    console.log("Input Reading Date:", reading);
    // Convert to Oracle DATE format (YYYY-MM-DD)
    const formattedDate = inputDate.toISOString().split("T")[0];

    const payload = {
      data: { ...reading, reading_date: formattedDate },
      sqltypes: {
        id: 4,
        reading_date: 91,
        breakfast: 6,
        lunch: 6,
        dinner: 6,
        bedtime: 6,
        notes_for_day: 12,
      },
    };
    console.log("Creating Reading History:", JSON.stringify(payload));
    const response = await apiClient.post<ApiResponse<PatientReadingHistory>>(
      "/ReadingHistory/ReadingHistory",
      payload
    );

    if (response.data.code !== 0) {
      //console.error("POST Reading History API Error Details:" + response.data.message);
      throw new Error("POST Reading History API Error - " + response.data.message);
    }

    return {
      ...response.data.data,
      // Ensure proper typing for numeric fields
      breakfast: Number(response.data.data.breakfast),
      lunch: Number(response.data.data.lunch),
      dinner: Number(response.data.data.dinner),
      bedtime: Number(response.data.data.bedtime),
    };
  },
};
