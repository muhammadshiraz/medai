// src/hooks/useRecommendations.ts
import { useState, useEffect } from "react";
import { RecommendationService } from "@/lib/api/recommendationService";
import type {
  Recommendation,
  PatientType,
  DrugType,
} from "@/types/recommendation";

type RecommendationQueryParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
};

export const useRecommendations = (
  initialParams?: RecommendationQueryParams
) => {
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 10;

  const [allRecommendations, setAllRecommendations] = useState<
    Recommendation[]
  >([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<
    Recommendation[]
  >([]);
  const [patientTypes, setPatientTypes] = useState<PatientType[]>([]);
  const [drugTypes, setDrugTypes] = useState<DrugType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<RecommendationQueryParams>({
    page: 1,
    pageSize: 20,
    ...initialParams,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientsRes, drugsRes, recsRes] = await Promise.all([
        RecommendationService.getPatientTypes(),
        RecommendationService.getDrugTypes(),
        RecommendationService.getRecommendations(
          params.page || 1,
          params.pageSize || 20,
          params.sortBy,
          params.sortDirection
        ),
      ]);

      const enrichedData = recsRes.data.map((rec: Recommendation) => ({
        ...rec,
        patient_name:
          patientsRes.find((p: PatientType) => p.id === rec.patient_id)?.name ||
          "Unknown",
        drug_name:
          drugsRes.find((d: DrugType) => d.id === rec.drug_id)?.drug_name ||
          "Unknown",
      }));

      setAllRecommendations(enrichedData);
      setFilteredRecommendations(enrichedData);
      setPatientTypes(patientsRes);
      setDrugTypes(drugsRes);
      setTotalCount(recsRes.total);
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

  useEffect(() => {
    const filterRecommendations = () => {
      if (!searchQuery) return allRecommendations;

      const lowerQuery = searchQuery.toLowerCase().trim();

      return allRecommendations.filter((rec) => {
        const patientName =
          patientTypes
            .find((p) => p.id === rec.patient_id)
            ?.name?.toLowerCase() || "";

        const drugName = (rec.drug_name || "").toLowerCase();
        const timeOfReading = rec.time_of_reading.toLowerCase();
        const recDate = new Date(rec.recommendation_date)
          .toLocaleDateString()
          .toLowerCase();

        return [
          rec.id.toString(),
          rec.patient_id.toString(),
          patientName,
          drugName,
          rec.dosage.toString(),
          timeOfReading,
          recDate,
          rec.drug_id.toString(),
        ].some((value) => value?.includes(lowerQuery));
      });
    };

    const filtered = filterRecommendations();
    setFilteredRecommendations(filtered);
    setTotalCount(filtered.length);
    setClientPage(1);
  }, [searchQuery, allRecommendations, patientTypes]);

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

  const createRecommendation = async (newRec: Omit<Recommendation, "id">) => {
    try {
      const created = await RecommendationService.createRecommendation(newRec);
      setAllRecommendations((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create recommendation"
      );
    }
  };

  return {
    recommendations: filteredRecommendations,
    patientTypes,
    drugTypes,
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
    createRecommendation,
    refresh: fetchData,
  };
};
