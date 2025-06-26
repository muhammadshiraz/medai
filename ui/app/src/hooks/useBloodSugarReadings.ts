import { useState, useEffect } from "react";
import { BloodSugarService } from "@/lib/api/bloodSugarService";
import type { BloodSugarReading } from "@/types/bloodSugar";
import type { Patient } from "@/types/patient";

type BloodSugarQueryParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
};

export const useBloodSugarReadings = (
  initialParams?: BloodSugarQueryParams,
  patients: Patient[] = []
) => {
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 10;

  const [allReadings, setAllReadings] = useState<BloodSugarReading[]>([]);
  const [filteredReadings, setFilteredReadings] = useState<BloodSugarReading[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<BloodSugarQueryParams>({
    page: 1,
    pageSize: 10,
    ...initialParams,
  });

  const fetchReadings = async () => {
    try {
      setLoading(true);
      const { data } = await BloodSugarService.getBloodSugarReadings(
        params.page || 1,
        params.pageSize || 10,
        params.sortBy,
        params.sortDirection || "asc"
      );

      const enrichedData = data.map((reading) => ({
        ...reading,
        patient_name:
          patients.find((p) => p.id === reading.patient_id)?.name || "Unknown",
      }));

      setAllReadings(enrichedData);
      setFilteredReadings(enrichedData);
      setTotalCount(enrichedData.length);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch readings");
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, [
    patients,
    params.page,
    params.pageSize,
    params.sortBy,
    params.sortDirection,
    params.search,
  ]);

  useEffect(() => {
    const filterReadings = () => {
      if (!searchQuery) return allReadings;

      const lowerQuery = searchQuery.toLowerCase().trim();

      return allReadings.filter((reading) => {
        const patientName =
          patients
            .find((p) => p.id === reading.patient_id)
            ?.name?.toLowerCase() || "";

        const formattedDate = new Date(reading.reading_date)
          .toLocaleDateString()
          .toLowerCase();

        return [
          reading.id?.toString(),
          reading.patient_id.toString(),
          patientName,
          reading.time_of_reading?.toLowerCase(),
          reading.reading_value.toString(),
          formattedDate,
          reading.notes?.toLowerCase(),
        ].some((value) => value?.includes(lowerQuery));
      });
    };

    const filtered = filterReadings();
    setFilteredReadings(filtered);
    setTotalCount(filtered.length);
    setClientPage(1);
  }, [searchQuery, allReadings, patients]);

  const handleSearch = (query: string) => {
    setSearchQuery(query.trim());
  };

  const handlePageChange = (newPage: number) => {
    setClientPage(Math.max(1, Math.min(newPage, Math.ceil(totalCount / itemsPerPage))));
  };

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setParams((prev) => ({
      ...prev,
      sortBy: column,
      sortDirection: direction,
    }));
  };

  const createReading = async (newReading: Omit<BloodSugarReading, "id">) => {
    try {
      const created = await BloodSugarService.createReading(newReading);
      setAllReadings((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create reading"
      );
    }
  };

  return {
    readings: filteredReadings,
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
    createReading,
    refresh: fetchReadings,
  };
};
