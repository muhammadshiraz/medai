// src/app/patient-labs/page.tsx
"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePageTitle } from "@/context/PageTitleContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";
import SearchInput from "@/components/Search/SearchInput";
import { DataTable, ColumnDef } from "@/components/DataTable/DataTable";
import { AddLabModal } from "@/components/Lab/AddLabModal";
import { usePatientLabs } from "@/hooks/usePatientLabs";
import type { PatientLab } from "@/types/patientLab";
import { usePatients } from "@/hooks/usePatients";
import { RefreshButton } from "@/components/RefreshButton";

export default function PatientLabsPage() {
  const { setTitle } = usePageTitle();
  const { patients } = usePatients();
  const {
    labs,
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
    createLab,
    refresh,
  } = usePatientLabs();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setTitle("Patient Lab Results");
  }, [setTitle]);

  const patientLookup = useMemo(() => {
    return patients.reduce((acc: Record<number, string>, patient) => {
      acc[patient.id] = patient.name;
      return acc;
    }, {});
  }, [patients]);

  const columns: ColumnDef<PatientLab>[] = [
    {
      key: "id",
      header: "Lab ID",
      sortable: true,
    },
    {
      key: "patient_id",
      header: "Patient",
      sortable: true,
      cellRenderer: (row) => (
        <Link
          href={`/patient/${row.patient_id}`}
          className="text-medical-primary hover:underline"
        >
          {patientLookup[row.patient_id] || "Unknown"}
        </Link>
      ),
    },
    {
      key: "lab_name",
      header: "Lab Name",
      sortable: true,
    },
    {
      key: "lab_test_name",
      header: "Test Name",
      sortable: true,
    },
    {
      key: "lab_test_code",
      header: "Test Code",
      sortable: true,
    },
    {
      key: "lab_date",
      header: "Date",
      sortable: true,
      cellRenderer: (row) => new Date(row.lab_date).toLocaleDateString(),
    },
    {
      key: "lab_result",
      header: "Result",
      sortable: true,
      cellRenderer: (row) => (
        <span className="font-medium">{row.lab_result}</span>
      ),
    },
    {
      key: "lab_test_description",
      header: "Description",
      cellRenderer: (row) => row.lab_test_description || "–",
    },
  ];

  const handleAddLab = async (newLab: Omit<PatientLab, "id">) => {
    try {
      await createLab(newLab);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add lab:", err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ProtectedRoute>
      <div className="w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <nav className="mt-2 text-sm">
              <Link href="/" className="text-medical-primary hover:underline">
                Home
              </Link>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-gray-500">Lab Results</span>
            </nav>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <SearchInput
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search lab results..."
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
          <DataTable<PatientLab>
            columns={columns}
            data={labs}
            totalCount={totalCount}
            sortConfig={
              sortBy
                ? { key: sortBy, direction: sortDirection || "asc" }
                : undefined
            }
            onSort={handleSort}
            currentPage={currentPage}
            itemsPerPage={20}
            onPageChange={handlePageChange}
          />
        )}

        <AddLabModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddLab}
        />
      </div>
    </ProtectedRoute>
  );
}
