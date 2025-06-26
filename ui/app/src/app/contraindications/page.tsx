"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePageTitle } from "@/context/PageTitleContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";
import SearchInput from "@/components/Search/SearchInput";
import { DataTable, ColumnDef } from "@/components/DataTable/DataTable";
import { AddContraindicationModal } from "@/components/Contraindication/AddContraindicationModal";
import { useContraindications } from "@/hooks/useContraindications";
import type { Contraindication } from "@/types/contraindication";
import { RefreshButton } from "@/components/RefreshButton";

export default function ContraindicationsPage() {
  const { setTitle } = usePageTitle();
  const {
    contraindications,
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
    createContraindication,
    refresh,
  } = useContraindications();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setTitle("Contraindication Management");
  }, [setTitle]);

  const columns: ColumnDef<Contraindication>[] = [
    { key: "id", header: "ID", sortable: true },
    { key: "drug_name", header: "Drug Name", sortable: true, minWidth: 150 },
    { key: "condition", header: "Condition", sortable: true, minWidth: 200 },
    { key: "severity", header: "Severity", sortable: true },
    {
      key: "description",
      header: "Description",
      cellRenderer: (row) => (
        <div className="max-w-[300px] truncate hover:overflow-visible hover:z-50">
          {row.description}
        </div>
      ),
      minWidth: 300,
    },
    {
      key: "recommendation",
      header: "Recommendation",
      cellRenderer: (row) => (
        <div className="max-w-[300px] truncate hover:overflow-visible hover:z-50">
          {row.recommendation}
        </div>
      ),
      minWidth: 300,
    },
  ];

  const handleAddContraindication = async (
    contra: Omit<Contraindication, "id">
  ) => {
    try {
      await createContraindication(contra);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add contraindication:", err);
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
              <span className="text-gray-500">Contraindications</span>
            </nav>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <SearchInput
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search contraindications..."
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

        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
        ) : (
          <DataTable<Contraindication>
            columns={columns}
            data={contraindications}
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

        <AddContraindicationModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddContraindication}
        />
      </div>
    </ProtectedRoute>
  );
}
