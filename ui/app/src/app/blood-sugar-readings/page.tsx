// src/app/blood-sugar-readings/page.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePageTitle } from "@/context/PageTitleContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";
import SearchInput from "@/components/Search/SearchInput";
import { DataTable } from "@/components/DataTable/DataTable";
import { AddReadingModal } from "@/components/BloodSugar/AddReadingModal";
import { usePatients } from "@/hooks/usePatients";
import { useBloodSugarReadings } from "@/hooks/useBloodSugarReadings";
import { ColumnDef } from "@/components/DataTable/DataTable";
import type { BloodSugarReading } from "@/types/bloodSugar";
import { RefreshButton } from "@/components/RefreshButton";

export default function BloodSugarReadingsPage() {
  const { setTitle } = usePageTitle();
  const { patients } = usePatients();
  const {
    readings = [],
    loading,
    totalCount,
    error,
    currentPage,
    handlePageChange,
    searchInput,
    handleSearch,
    handleSort,
    createReading,
    refresh,
    sortBy,
    sortDirection,
  } = useBloodSugarReadings(undefined, patients);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setTitle("Blood Sugar Readings");
  }, [setTitle]);

  const patientLookup = useMemo(() => {
    return patients.reduce((acc: Record<number, string>, patient) => {
      acc[patient.id] = patient.name;
      return acc;
    }, {});
  }, [patients]);

  const columns: ColumnDef<BloodSugarReading>[] = [
    {
      key: "id",
      header: "Reading ID",
      sortable: true,
    },
    {
      key: "patient_id",
      header: "Patient ID",
      sortable: true,
      cellRenderer: (row) => (
        <Link
          href={`/patient/${row.patient_id}`}
          className="text-medical-primary dark:text-gray-400 hover:underline"
        >
          {patientLookup[row.patient_id]}
        </Link>
      ),
    },
    {
      key: "time_of_reading",
      header: "Time",
      sortable: true,
    },
    {
      key: "reading_value",
      header: "Value (mg/dL)",
      sortable: true,
      align: "right",
      cellRenderer: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.reading_value > 180
              ? "bg-red-100 text-red-800"
              : row.reading_value < 70
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {row.reading_value} mg/dL
        </span>
      ),
    },
    {
      key: "reading_date",
      header: "Date",
      sortable: true,
      cellRenderer: (row) => new Date(row.reading_date).toLocaleDateString(),
    },
    {
      key: "notes",
      header: "Notes",
      cellRenderer: (row) => row.notes || "–",
    },
  ];

  const handleAddReading = async (
    newReading: Omit<BloodSugarReading, "id">
  ) => {
    try {
      await createReading(newReading);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add reading:", err);
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
              <Link
                href="/patient"
                className="text-medical-primary hover:underline"
              >
                Patient
              </Link>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-gray-500">Blood Sugar Readings</span>
            </nav>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <SearchInput
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search readings..."
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
          <DataTable<BloodSugarReading>
            columns={columns}
            data={readings}
            totalCount={totalCount}
            sortConfig={
              sortBy
                ? {
                    key: sortBy,
                    direction: sortDirection || "desc",
                  }
                : undefined
            }
            onSort={handleSort}
            currentPage={currentPage}
            itemsPerPage={10}
            onPageChange={handlePageChange}
          />
        )}

        <AddReadingModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddReading}
        />
      </div>
    </ProtectedRoute>
  );
}
