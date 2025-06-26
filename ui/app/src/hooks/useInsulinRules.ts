// src/hooks/useInsulinRules.ts
import { useState, useEffect } from "react";
import { InsulinRuleService } from "@/lib/api/insulinRuleService";
import type { InsulinRule } from "@/types/insulinRule";

type InsulinRuleQueryParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
};

export const useInsulinRules = (
  initialParams?: InsulinRuleQueryParams
) => {
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 10;

  const [allRules, setAllRules] = useState<InsulinRule[]>([]);
  const [filteredRules, setFilteredRules] = useState<InsulinRule[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<InsulinRuleQueryParams>({
    page: 1,
    pageSize: 20,
    ...initialParams,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await InsulinRuleService.getInsulinRules(
        params.page || 1,
        params.pageSize || 20,
        params.sortBy,
        params.sortDirection
      );

      setAllRules(res.data);
      setFilteredRules(res.data);
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
    const filterRules = () => {
      if (!searchQuery) return allRules;

      const lowerQuery = searchQuery.toLowerCase().trim();

      return allRules.filter((rule) => {
        return [
          rule.id.toString(),
          rule.blood_sugar_reading,
          rule.blood_sugar_level.toString(),
          rule.glargine_before_dinner?.toString() || '',
          rule.lispro_before_breakfast?.toString() || '',
          rule.lispro_before_lunch?.toString() || '',
          rule.lispro_before_dinner?.toString() || ''
        ].some(value => value.toLowerCase().includes(lowerQuery));
      });
    };

    const filtered = filterRules();
    setFilteredRules(filtered);
    setTotalCount(filtered.length);
    setClientPage(1);
  }, [searchQuery, allRules]);

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
    setParams(prev => ({
      ...prev,
      sortBy: column,
      sortDirection: direction,
    }));
  };

  const createInsulinRule = async (newRule: Omit<InsulinRule, "id">) => {
    try {
      const created = await InsulinRuleService.createInsulinRule(newRule);
      setAllRules(prev => [created, ...prev]);
      return created;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create insulin rule"
      );
    }
  };

  return {
    rules: filteredRules,
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
    createInsulinRule,
    refresh: fetchData,
  };
};