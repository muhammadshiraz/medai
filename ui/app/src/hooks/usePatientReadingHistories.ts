// hooks/usePatientReadingHistories.ts
import { useState, useEffect } from "react";
import { PatientReadingHistoryService } from "@/lib/api/patientReadingHistoryService";
import type { PatientReadingHistory } from "@/types/patientReadingHistory";
import type { Patient } from "@/types/patient";

type ReadingHistoryQueryParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
};

export const usePatientReadingHistories = (
  initialParams?: ReadingHistoryQueryParams,
  patients: Patient[] = []
) => {
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 10;

  const [allHistories, setAllHistories] = useState<PatientReadingHistory[]>([]);
  const [filteredHistories, setFilteredHistories] = useState<
    PatientReadingHistory[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ReadingHistoryQueryParams>({
    page: 1,
    pageSize: 10,
    ...initialParams,
  });

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const { data } =
        await PatientReadingHistoryService.getPatientReadingHistories(
          params.page || 1,
          params.pageSize || 10,
          params.sortBy,
          params.sortDirection || "asc"
        );

      const enrichedData = data.map((history) => ({
        ...history,
        patient_name:
          patients.find((p) => p.id === history.patient_id)?.name || "Unknown",
      }));

      setAllHistories(enrichedData);
      setFilteredHistories(enrichedData);
      setTotalCount(enrichedData.length);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch histories"
      );
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, [
    patients,
    params.page,
    params.pageSize,
    params.sortBy,
    params.sortDirection,
    params.search,
  ]);

  useEffect(() => {
    const filterHistories = () => {
      if (!searchQuery) {
        return allHistories;
      }

      const lowerQuery = searchQuery.toLowerCase().trim();

      return allHistories.filter((history) => {
        const patientName =
          patients
            .find((p) => p.id === history.patient_id)
            ?.name?.toLowerCase() || "";

        const formattedDate = new Date(history.reading_date)
          .toLocaleDateString()
          .toLowerCase();

        return [
          history.id.toString(),
          history.patient_id?.toString(),
          patientName,
          formattedDate,
          history.breakfast?.toString(),
          history.lunch?.toString(),
          history.dinner?.toString(),
          history.bedtime?.toString(),
          history.notes_for_day?.toLowerCase(),
        ].some((value) => value?.includes(lowerQuery));
      });
    };

    const filtered = filterHistories();
    setFilteredHistories(filtered);
    setTotalCount(filtered.length);
    setClientPage(1);
  }, [searchQuery, allHistories, patients]);

  const handleSearch = (query: string) => {
    setSearchQuery(query.trim());
  };

  const handlePageChange = (newPage: number) => {
    setClientPage(
      Math.max(1, Math.min(newPage, Math.ceil(totalCount / itemsPerPage)))
    );
  };

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setParams((prev) => ({
      ...prev,
      sortBy: column,
      sortDirection: direction,
    }));
  };

  const createHistory = async (
    newHistory: Omit<PatientReadingHistory, "id">
  ) => {
    try {
      const created = await PatientReadingHistoryService.createReadingHistory(
        newHistory
      );
      setAllHistories((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create history"
      );
    }
  };

  const updateHistory = async (
    id: number,
    updates: Partial<PatientReadingHistory>
  ) => {
    try {
      const updated = await PatientReadingHistoryService.updateReadingHistory(
        id,
        updates
      );
      setAllHistories((prev) =>
        prev.map((history) =>
          history.id === id
            ? { ...history, ...updated, reading_date: updated.reading_date }
            : history
        )
      );
      return updated;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update history"
      );
    }
  };

  return {
    histories: filteredHistories,
    totalCount,
    searchInput: searchQuery,
    handleSearch,
    loading,
    error,
    currentPage: clientPage,
    pageSize: params.pageSize || 10,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
    handlePageChange,
    handleSort,
    createHistory,
    refresh: fetchHistories,
    updateHistory,
  };
};
