// src/hooks/usePatientLabs.ts
import { useState, useEffect } from "react";
import { PatientLabService } from "@/lib/api/patientLabService";
import type { PatientLab } from "@/types/patientLab";
import { usePatients } from "@/hooks/usePatients";

type LabQueryParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
};

export const usePatientLabs = (initialParams?: LabQueryParams) => {
  const { patients } = usePatients();
  const [labs, setLabs] = useState<PatientLab[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery] = useState<string>("");
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<LabQueryParams>({
    page: 1,
    pageSize: 20,
    ...initialParams,
  });

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const { data, total } = await PatientLabService.getPatientLabs(
        params.page,
        params.pageSize,
        params.sortBy,
        params.sortDirection
      );

      const enrichedData = data.map((lab) => ({
        ...lab,
        patient_name:
          patients.find((p) => p.id === lab.patient_id)?.name || "Unknown",
      }));

      setLabs(enrichedData);
      setTotalCount(total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "API Error");
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, [params, patients]);

  const handleSearch = (searchValue: string) => {
    setParams((prev) => ({
      ...prev,
      search: searchValue,
      page: 1, // Reset to first page when searching
    }));
  };

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setParams((prev) => ({
      ...prev,
      sortBy: column,
      sortDirection: direction,
    }));
  };

  const createLab = async (newLab: Omit<PatientLab, "id">) => {
    const created = await PatientLabService.createLab(newLab);
    setLabs((prev) => [created, ...prev]);
    return created;
  };

  const handlePageChange = (newPage: number) => {
    setClientPage(
      Math.max(1, Math.min(newPage, Math.ceil(totalCount / itemsPerPage)))
    );
  };

  return {
    labs,
    loading,
    searchInput: searchQuery,
    currentPage: clientPage,
    error,
    totalCount,
    createLab,
    handlePageChange,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
    handleSort,
    handleSearch,
    refresh: fetchLabs,
  };
};
