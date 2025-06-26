// src/app/drugs/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePageTitle } from "@/context/PageTitleContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";
import SearchInput from "@/components/Search/SearchInput";
import { DataTable, ColumnDef } from "@/components/DataTable/DataTable";
import { AddDrugModal } from "@/components/Drug/AddDrugModal";
import { useDrugs } from "@/hooks/useDrugs";
import type { Drug } from "@/types/drug";
import { RefreshButton } from "@/components/RefreshButton";

export default function DrugsPage() {
  const { setTitle } = usePageTitle();
  const {
    drugs,
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
    createDrug,
    refresh,
  } = useDrugs();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setTitle("Drug Management");
  }, [setTitle]);

  const columns: ColumnDef<Drug>[] = [
    { key: "id", header: "ID", sortable: true },
    { key: "drug_name", header: "Drug Name", sortable: true },
    {
      key: "dosage",
      header: "Dosage",
      sortable: true,
      cellRenderer: (row) => `${row.dosage} ${row.dosage_unit}`,
    },
    { key: "drug_type", header: "Type", sortable: true },
    { key: "manufacturer", header: "Manufacturer", sortable: true },
    {
      key: "side_effects",
      header: "Side Effects",
      cellRenderer: (row) => (
        <div className="max-w-[300px] break-words whitespace-pre-line">
          {row.side_effects || "No side effects reported"}
        </div>
      ),
      minWidth: 300,
    },
  ];

  const handleAddDrug = async (drug: Omit<Drug, "id">) => {
    try {
      await createDrug(drug);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add drug:", err);
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
              <span className="text-gray-500">Drugs</span>
            </nav>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <SearchInput
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search drugs..."
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
              Add New Drug
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
        ) : (
          <DataTable<Drug>
            columns={columns}
            data={drugs}
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
            className="min-w-[800px]"
          />
        )}

        <AddDrugModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddDrug}
        />
      </div>
    </ProtectedRoute>
  );
}
