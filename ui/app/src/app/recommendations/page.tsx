// src/app/recommendations/page.tsx
"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePageTitle } from "@/context/PageTitleContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";
import SearchInput from "@/components/Search/SearchInput";
import { DataTable, ColumnDef } from "@/components/DataTable/DataTable";
import { AddRecommendationModal } from "@/components/Recommendation/AddRecommendationModal";
import { useRecommendations } from "@/hooks/useRecommendations";
import type { Recommendation } from "@/types/recommendation";
import { RefreshButton } from "@/components/RefreshButton";

export default function RecommendationsPage() {
  const { setTitle } = usePageTitle();
  const {
    recommendations,
    patientTypes,
    drugTypes,
    loading,
    error,
    totalCount,
    searchInput,
    handleSearch,
    currentPage,
    handlePageChange,
    sortBy,
    sortDirection,
    handleSort,
    createRecommendation,
    refresh,
  } = useRecommendations();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setTitle("Recommendation Management");
  }, [setTitle]);

  const patientLookup = useMemo(() => {
    return patientTypes.reduce((acc: Record<number, string>, patient) => {
      acc[patient.id] = patient.name;
      return acc;
    }, {});
  }, [patientTypes]);

  const drugLookup = useMemo(() => {
    return drugTypes.reduce((acc: Record<number, string>, drug) => {
      acc[drug.id] = drug.drug_name;
      return acc;
    }, {});
  }, [drugTypes]);

  const columns: ColumnDef<Recommendation>[] = [
    {
      key: "id",
      header: "ID",
      sortable: true,
    },
    {
      key: "dosage",
      header: "Dosage",
      sortable: true,
      cellRenderer: (row) => `${row.dosage} ${row.dosage_unit}`,
    },
    {
      key: "drug_id",
      header: "Drug",
      sortable: true,
      cellRenderer: (row) => drugLookup[row.drug_id] || "Unknown",
    },
    {
      key: "patient_id",
      header: "Patient ID",
      sortable: true,
      cellRenderer: (row) => {
        const patientName = patientLookup[row.patient_id] || "Unknown";
        return (
          <Link
            href={`/patient/${row.patient_id}`}
            className="text-medical-primary dark:text-gray-400 hover:underline"
          >
            {patientName}
          </Link>
        );
      },
    },

    {
      key: "time_of_reading",
      header: "Time of Reading",
      sortable: true,
    },
    {
      key: "recommendation_date",
      header: "Recommendation Date",
      sortable: true,
      cellRenderer: (row) =>
        new Date(row.recommendation_date).toLocaleDateString(),
    },
  ];

  const handleAddRecommendation = async (rec: Omit<Recommendation, "id">) => {
    try {
      await createRecommendation(rec);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add recommendation:", err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ProtectedRoute>
      <div className="w-full mx-auto">
        {/* Header similar to MedicationsPage */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <nav className="mt-2 text-sm">
              <Link href="/" className="text-medical-primary hover:underline">
                Home
              </Link>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-gray-500">Recommendations</span>
            </nav>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <SearchInput
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search recommendations..."
              className="flex-1"
            />
            <RefreshButton onClick={refresh} className="flex items-center" />
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-primary-dark flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New
            </button>
          </div>
        </div>

        {/* Data Table */}
        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
        ) : (
          <DataTable<Recommendation>
            columns={columns}
            data={recommendations}
            totalCount={totalCount}
            sortConfig={
              sortBy
                ? { key: sortBy, direction: sortDirection || "asc" }
                : undefined
            }
            onSort={handleSort}
            currentPage={currentPage}
            itemsPerPage={10}
            onPageChange={handlePageChange}
          />
        )}

        <AddRecommendationModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddRecommendation}
          drugTypes={drugTypes}
          patientTypes={patientTypes}
        />
      </div>
    </ProtectedRoute>
  );
}
