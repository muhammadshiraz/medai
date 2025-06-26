// src/hooks/useDrugUnits.ts
import { useState, useEffect } from "react";
import { DrugUnitService } from "@/lib/api/drugUnitService";
import type { DrugUnit } from "@/types/drugUnit";

type DrugUnitQueryParams = {
  page?: number;
  pageSize?: number;
};

export const useDrugUnits = (initialParams?: DrugUnitQueryParams) => {
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 10;

  const [allUnits, setAllUnits] = useState<DrugUnit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<DrugUnit[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params] = useState<DrugUnitQueryParams>({
    page: 1,
    pageSize: 20,
    ...initialParams,
  });

  useEffect(() => {
    const filterUnits = () => {
      if (!searchQuery) return allUnits;
      const lowerQuery = searchQuery.toLowerCase().trim();
      return allUnits.filter((unit) =>
        unit.unit_name.toLowerCase().includes(lowerQuery)
      );
    };

    const filtered = filterUnits();
    setFilteredUnits(filtered);
    setTotalCount(filtered.length);
    setClientPage(1);
  }, [searchQuery, allUnits]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await DrugUnitService.getDrugUnits(
        params.page || 1,
        params.pageSize || 20
      );

      setAllUnits(res.data);
      setFilteredUnits(res.data);
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

  const createDrugUnit = async (unit: DrugUnit) => {
    try {
      const created = await DrugUnitService.createDrugUnit(unit);
      setAllUnits((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create drug unit"
      );
    }
  };

  return {
    units: filteredUnits,
    totalCount,
    searchInput: searchQuery,
    handleSearch,
    loading,
    error,
    currentPage: clientPage,
    pageSize: params.pageSize || 10,
    handlePageChange,
    createDrugUnit,
    refresh: fetchData,
  };
};
