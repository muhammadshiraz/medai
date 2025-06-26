// src/app/dosages/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePageTitle } from "@/context/PageTitleContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";
import SearchInput from "@/components/Search/SearchInput";
import { DataTable, ColumnDef } from "@/components/DataTable/DataTable";
import { AddDosageModal } from "@/components/Dosage/AddDosageModal";
import { useDosages } from "@/hooks/useDosages";
import type { Dosage } from "@/types/dosage";
import { RefreshButton } from "@/components/RefreshButton";

export default function DosagesPage() {
  const { setTitle } = usePageTitle();
  const {
    dosages,
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
    createDosage,
    refresh,
  } = useDosages();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setTitle("Dosage Management");
  }, [setTitle]);

  const columns: ColumnDef<Dosage>[] = [
    { key: "id", header: "ID", sortable: true },
    { key: "drug_name", header: "Drug Name", sortable: true, minWidth: 150 },
    { key: "dosage_unit", header: "Unit", sortable: true },
    { key: "drug_type", header: "Type", sortable: true },
    {
      key: "min_dose",
      header: "Dose Range",
      cellRenderer: (row) =>
        `${row.min_dose ?? ""}${row.max_dose ? `-${row.max_dose}` : ""} ${
          row.dosage_unit
        }`,
      minWidth: 120,
    },
    {
      key: "min_age",
      header: "Age Range",
      cellRenderer: (row) =>
        `${row.min_age ?? ""}${row.max_age ? `-${row.max_age} years` : ""}`,
      minWidth: 120,
    },
    {
      key: "min_weight",
      header: "Weight Range",
      cellRenderer: (row) =>
        `${row.min_weight ?? ""}${
          row.max_weight ? `-${row.max_weight} kg` : ""
        }`,
      minWidth: 140,
    },
    {
      key: "min_creatine",
      header: "Creatine Range",
      cellRenderer: (row) =>
        `${row.min_creatine ?? ""}${
          row.max_creatine ? `-${row.max_creatine} mg/dL` : ""
        }`,
      minWidth: 160,
    },
  ];

  const handleAddDosage = async (dosage: Omit<Dosage, "id">) => {
    try {
      await createDosage(dosage);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add dosage:", err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ProtectedRoute>
      <div className="w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <nav className="mt-2 text-sm">
              <Link href="/" className="text-medical-primary hover:underline">
                Home
              </Link>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-gray-500">Dosages</span>
            </nav>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <SearchInput
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search dosages..."
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
              Add New Dosage
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
        ) : (
          <DataTable<Dosage>
            columns={columns}
            data={dosages}
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
            className="min-w-[1000px]"
          />
        )}

        <AddDosageModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddDosage}
        />
      </div>
    </ProtectedRoute>
  );
}
