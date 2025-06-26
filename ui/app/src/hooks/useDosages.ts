// src/hooks/useDosages.ts
import { useState, useEffect } from "react";
import { DosageService } from "@/lib/api/dosageService";
import type { Dosage } from "@/types/dosage";

type DosageQueryParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
};

export const useDosages = (initialParams?: DosageQueryParams) => {
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 10;

  const [allDosages, setAllDosages] = useState<Dosage[]>([]);
  const [filteredDosages, setFilteredDosages] = useState<Dosage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<DosageQueryParams>({
    page: 1,
    pageSize: 20,
    ...initialParams,
  });

  useEffect(() => {
    const filterDosages = () => {
      if (!searchQuery) return allDosages;
      const lowerQuery = searchQuery.toLowerCase().trim();

      return allDosages.filter((dosage) => {
        return [
          dosage.id.toString(),
          dosage.drug_id.toString(),
          dosage.drug_name,
          dosage.dosage_unit,
          dosage.drug_type,
          dosage.min_dose?.toString() || "",
          dosage.max_dose?.toString() || "",
          dosage.min_age?.toString() || "",
          dosage.max_age?.toString() || "",
          dosage.min_weight?.toString() || "",
          dosage.max_weight?.toString() || "",
          dosage.min_creatine?.toString() || "",
          dosage.max_creatine?.toString() || "",
        ].some((value) => value.toLowerCase().includes(lowerQuery));
      });
    };

    const filtered = filterDosages();
    setFilteredDosages(filtered);
    setTotalCount(filtered.length);
    setClientPage(1);
  }, [searchQuery, allDosages]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await DosageService.getDosages(
        params.page || 1,
        params.pageSize || 20,
        params.sortBy,
        params.sortDirection
      );

      setAllDosages(res.data);
      setFilteredDosages(res.data);
      setTotalCount(res.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "API Error");
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

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

  const createDosage = async (newDosage: Omit<Dosage, "id">) => {
    try {
      const created = await DosageService.createDosage(newDosage);
      setAllDosages((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create dosage"
      );
    }
  };

  return {
    dosages: filteredDosages,
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
    createDosage,
    refresh: fetchData,
  };
};
