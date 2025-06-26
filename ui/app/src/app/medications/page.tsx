// src/app/medications/page.tsx
"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePageTitle } from "@/context/PageTitleContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";
import SearchInput from "@/components/Search/SearchInput";
import { DataTable, ColumnDef } from "@/components/DataTable/DataTable";
import { AddMedicationModal } from "@/components/Medication/AddMedicationModal";
import { useMedications } from "@/hooks/useMedications";
import type { Medication } from "@/types/medication";
import { RefreshButton } from "@/components/RefreshButton";

export default function MedicationsPage() {
  const { setTitle } = usePageTitle();
  const {
    medications,
    patientTypes,
    loading,
    error,
    totalCount,
    createMedication,
    refresh,
    searchInput,
    handleSearch,
    currentPage,
    handlePageChange,
    sortBy,
    sortDirection,
    handleSort,
    drugTypes,
  } = useMedications();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setTitle("Medication Management");
  }, [setTitle]);

  const patientLookup = useMemo(() => {
    return patientTypes.reduce((acc: Record<number, string>, patient) => {
      acc[patient.id] = patient.name;
      return acc;
    }, {});
  }, [patientTypes]);

  const columns: ColumnDef<Medication>[] = [
    {
      key: "id",
      header: "ID",
      sortable: true,
    },
    {
      key: "dosage",
      header: "Dosage",
      sortable: true,
      align: "left",
      cellRenderer: (row) => `${row.dosage} ${row.dosage_unit}`,
    },
    {
      key: "drug_name",
      header: "Drug ID",
      sortable: true,
      cellRenderer: (row) => row.drug_name || "Unknown",
    },
    {
      key: "patient_id",
      header: "Patient",
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
  ];

  const handleAddMedication = async (med: Omit<Medication, "id">) => {
    try {
      await createMedication(med);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add medication:", err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ProtectedRoute>
      <div className="w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <nav className="mt-2 text-sm">
              <Link
                href="/patient"
                className="text-medical-primary hover:underline"
              >
                Patient
              </Link>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-gray-500">Medication Management</span>
            </nav>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <SearchInput
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search medications..."
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
          <DataTable<Medication>
            columns={columns}
            data={medications}
            totalCount={totalCount}
            sortConfig={
              sortBy
                ? {
                    key: sortBy,
                    direction: sortDirection || "asc",
                  }
                : undefined
            }
            onSort={handleSort}
            currentPage={currentPage}
            itemsPerPage={10}
            onPageChange={handlePageChange}
          />
        )}

        <AddMedicationModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddMedication}
          patientTypes={patientTypes}
          drugTypes={drugTypes}
        />
      </div>
    </ProtectedRoute>
  );
}
