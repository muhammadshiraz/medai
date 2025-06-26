// src/app/insulin-rules/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePageTitle } from "@/context/PageTitleContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";
import SearchInput from "@/components/Search/SearchInput";
import { DataTable, ColumnDef } from "@/components/DataTable/DataTable";
import { AddInsulinRuleModal } from "@/components/InsulinRule/AddInsulinRuleModal";
import { useInsulinRules } from "@/hooks/useInsulinRules";
import type { InsulinRule } from "@/types/insulinRule";
import { RefreshButton } from "@/components/RefreshButton";

export default function InsulinRulesPage() {
  const { setTitle } = usePageTitle();
  const {
    rules,
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
    createInsulinRule,
    refresh,
  } = useInsulinRules();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setTitle("Insulin Rule Management");
  }, [setTitle]);

  const columns: ColumnDef<InsulinRule>[] = [
    { key: "id", header: "ID", sortable: true },
    { key: "blood_sugar_reading", header: "Reading Time", sortable: true },
    { key: "blood_sugar_level", header: "Blood Sugar Level", sortable: true },
    {
      key: "glargine_before_dinner",
      header: "Glargine (Dinner)",
      sortable: true,
      cellRenderer: (row) => row.glargine_before_dinner ?? "-",
    },
    {
      key: "lispro_before_breakfast",
      header: "Lispro (Breakfast)",
      sortable: true,
      cellRenderer: (row) => row.lispro_before_breakfast ?? "-",
    },
    {
      key: "lispro_before_lunch",
      header: "Lispro (Lunch)",
      sortable: true,
      cellRenderer: (row) => row.lispro_before_lunch ?? "-",
    },
    {
      key: "lispro_before_dinner",
      header: "Lispro (Dinner)",
      sortable: true,
      cellRenderer: (row) => row.lispro_before_dinner ?? "-",
    },
  ];

  const handleAddRule = async (rule: Omit<InsulinRule, "id">) => {
    try {
      await createInsulinRule(rule);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add insulin rule:", err);
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
              <span className="text-gray-500">Insulin Rules</span>
            </nav>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <SearchInput
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search insulin rules..."
              className="flex-1"
              value={searchInput}
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
              Add New Rule
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
        ) : (
          <DataTable<InsulinRule>
            columns={columns}
            data={rules}
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

        <AddInsulinRuleModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddRule}
        />
      </div>
    </ProtectedRoute>
  );
}
