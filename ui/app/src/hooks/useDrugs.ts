// src/hooks/useDrugs.ts
import { useState, useEffect } from "react";
import { DrugService } from "@/lib/api/drugService";
import type { Drug } from "@/types/drug";

type DrugQueryParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
};

export const useDrugs = (initialParams?: DrugQueryParams) => {
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 10;

  const [allDrugs, setAllDrugs] = useState<Drug[]>([]);
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<DrugQueryParams>({
    page: 1,
    pageSize: 20,
    ...initialParams,
  });

  useEffect(() => {
    const filterDrugs = () => {
      if (!searchQuery) return allDrugs;
      const lowerQuery = searchQuery.toLowerCase().trim();

      return allDrugs.filter((drug) => {
        return [
          drug.id.toString(),
          drug.drug_name,
          drug.dosage.toString(),
          drug.dosage_unit,
          drug.drug_type,
          drug.manufacturer,
          drug.side_effects || "",
        ].some((value) => value.toLowerCase().includes(lowerQuery));
      });
    };

    const filtered = filterDrugs();
    setFilteredDrugs(filtered);
    setTotalCount(filtered.length);
    setClientPage(1);
  }, [searchQuery, allDrugs]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await DrugService.getDrugs(
        params.page || 1,
        params.pageSize || 20,
        params.sortBy,
        params.sortDirection
      );

      setAllDrugs(res.data);
      setFilteredDrugs(res.data);
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

  const createDrug = async (newDrug: Omit<Drug, "id">) => {
    try {
      const created = await DrugService.createDrug(newDrug);
      setAllDrugs((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create drug"
      );
    }
  };

  return {
    drugs: filteredDrugs,
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
    createDrug,
    refresh: fetchData,
  };
};
