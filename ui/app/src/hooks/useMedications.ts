// src/hooks/useMedications.ts
import { useState, useEffect } from "react";
import { MedicationService } from "@/lib/api/medicationService";
import type { Medication, PatientType, DrugType } from "@/types/medication";

type MedicationQueryParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
};

export const useMedications = (initialParams?: MedicationQueryParams) => {
  const [drugTypes, setDrugTypes] = useState<DrugType[]>([]);

  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 10;

  const [allMedications, setAllMedications] = useState<Medication[]>([]);
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>(
    []
  );
  const [patientTypes, setPatientTypes] = useState<PatientType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<MedicationQueryParams>({
    page: 1,
    pageSize: 20,
    ...initialParams,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientsRes, drugsRes, medsRes] = await Promise.all([
        MedicationService.getPatientTypes(),
        MedicationService.getDrugTypes(),
        MedicationService.getMedications(
          params.page || 1,
          params.pageSize || 20,
          params.sortBy,
          params.sortDirection
        ),
      ]);

      const enrichedData = medsRes.data.map((med: Medication) => ({
        ...med,
        patient_name:
          patientsRes.find((p: PatientType) => p.id === med.patient_id)?.name ||
          "Unknown",
        drug_name:
          drugsRes.find((d: DrugType) => d.id === med.drug_id)?.drug_name ||
          "Unknown",
      }));

      setAllMedications(enrichedData);
      setFilteredMedications(enrichedData);
      setPatientTypes(patientsRes);
      setDrugTypes(drugsRes);
      setTotalCount(medsRes.total);
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
    const filterMedications = () => {
      if (!searchQuery) return allMedications;

      const lowerQuery = searchQuery.toLowerCase().trim();

      return allMedications.filter((med) => {
        const patientName =
          patientTypes
            .find((p) => p.id === med.patient_id)
            ?.name?.toLowerCase() || "";

            const drugName = (med.drug_name || "").toLowerCase();

        return [
          med.id.toString(),
          med.patient_id.toString(),
          patientName,
          drugName,
          med.dosage.toString(),
          med.dosage_unit.toLowerCase(),
          med.drug_id.toString(),
        ].some((value) => value?.includes(lowerQuery));
      });
    };

    const filtered = filterMedications();
    setFilteredMedications(filtered);
    setTotalCount(filtered.length);
    setClientPage(1);
  }, [searchQuery, allMedications, patientTypes]);

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

  const createMedication = async (newMed: Omit<Medication, "id">) => {
    try {
      const created = await MedicationService.createMedication(newMed);
      setAllMedications((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create medication"
      );
    }
  };

  return {
    medications: filteredMedications,
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
    createMedication,
    refresh: fetchData,
  };
};
