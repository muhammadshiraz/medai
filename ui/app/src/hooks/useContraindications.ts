import { useState, useEffect } from "react";
import { ContraindicationService } from "@/lib/api/contraindicationService";
import type { Contraindication } from "@/types/contraindication";

type ContraindicationQueryParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
};

export const useContraindications = (
  initialParams?: ContraindicationQueryParams
) => {
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 10;

  const [allContraindications, setAllContraindications] = useState<
    Contraindication[]
  >([]);
  const [filteredContraindications, setFilteredContraindications] = useState<
    Contraindication[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ContraindicationQueryParams>({
    page: 1,
    pageSize: 20,
    ...initialParams,
  });

  useEffect(() => {
    const filterContraindications = () => {
      if (!searchQuery) return allContraindications;
      const lowerQuery = searchQuery.toLowerCase().trim();

      return allContraindications.filter((contra) => {
        return [
          contra.id.toString(),
          contra.drug_id.toString(),
          contra.drug_name,
          contra.condition,
          contra.severity,
          contra.description,
          contra.recommendation,
        ].some((value) => value.toLowerCase().includes(lowerQuery));
      });
    };

    const filtered = filterContraindications();
    setFilteredContraindications(filtered);
    setTotalCount(filtered.length);
    setClientPage(1);
  }, [searchQuery, allContraindications]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await ContraindicationService.getContraindications(
        params.page || 1,
        params.pageSize || 20,
        params.sortBy,
        params.sortDirection
      );

      setAllContraindications(res.data);
      setFilteredContraindications(res.data);
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

  const createContraindication = async (
    newContra: Omit<Contraindication, "id">
  ) => {
    try {
      const created = await ContraindicationService.createContraindication(
        newContra
      );
      setAllContraindications((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create contraindication"
      );
    }
  };

  return {
    contraindications: filteredContraindications,
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
    createContraindication,
    refresh: fetchData,
  };
};
