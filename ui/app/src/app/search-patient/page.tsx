"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { usePageTitle } from "@/context/PageTitleContext";
import { useDebounce } from "@/hooks/useDebounce";
import { usePatients } from "@/hooks/usePatients";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";
import SearchInput from "@/components/Search/SearchInput";
import PatientCard from "@/components/PatientCard/PatientCard";
import Link from "next/link";

export default function SearchPatientPage() {
  const { setTitle } = usePageTitle();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { patients, loading, error } = usePatients(debouncedSearchTerm);

  useEffect(() => {
    setTitle("Patient Search");
  }, [setTitle]);

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb + Search Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4"
        >
          {/* Breadcrumb Navigation */}
          <nav className="text-sm text-gray-600 dark:text-gray-400">
            <ul className="flex space-x-2">
              <li>
                <Link href="/patient" className="hover:underline text-blue-600">
                  Patient
                </Link>                
              </li>
              <span className="mx-1">/</span>
              <li className="font-medium text-gray-900 dark:text-gray-400">Patient Search</li>
            </ul>
          </nav>

          {/* Search Input */}
          <SearchInput
            value={searchTerm}
            className="w-96"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, MRN, or diagnosis..."
          />
        </motion.div>

        {/* Loading & Error States */}
        {loading && (
          <div className="flex justify-center mt-12">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-50 text-red-700 rounded-lg mt-4"
          >
            Error loading patients: {error}
          </motion.div>
        )}

        {/* Results Grid */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {patients.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <UserCircleIcon className="mx-auto h-12 w-12 mb-4" />
                No patients found matching your search criteria
              </div>
            ) : (
              patients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))
            )}
          </motion.div>
        )}
      </div>
    </ProtectedRoute>
  );
}