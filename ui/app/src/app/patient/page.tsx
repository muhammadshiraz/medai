// src/app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  UserGroupIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { usePageTitle } from "@/context/PageTitleContext";
import { useDebounce } from "@/hooks/useDebounce";
import { usePatients } from "@/hooks/usePatients";
import PatientChart from "@/components/Dashboard/PatientChart";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";
import SearchInput from "@/components/Search/SearchInput";

interface DashboardStats {
  totalPatients: number;
  averageAge: number;
  averageHbA1c: number;
  genderDistribution: { male: number; female: number };
  conditions: { ckd: number; cad: number; hld: number };
  demographics: {
    adult: number;
    senior: number;
    pediatric: number;
  };
  healthIndicators: {
    highHbA1c: number;
    elevatedCreatinine: number;
    longDiabetesDuration: number;
    obesePatients: number;
  };
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  color: string;
}

interface ConditionProgressProps {
  label: string;
  value: number;
  color: string;
  threshold: number;
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon,
  trend,
  trendPositive,
  color,
}: StatsCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg dark:shadow-2xl flex"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
    >
      <div className="flex items-center justify-between w-full">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold mt-2 dark:text-white">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>{icon}</div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span
            className={`text-sm ${
              trendPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {trendPositive ? "↑" : "↓"} {trend}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default function PatientPage() {
  const { setTitle } = usePageTitle();
  const [lastLogin, setLastLogin] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { patients, loading, error } = usePatients(debouncedSearchTerm);

  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    averageAge: 0,
    averageHbA1c: 0,
    genderDistribution: { male: 0, female: 0 },
    conditions: { ckd: 0, cad: 0, hld: 0 },
    demographics: { adult: 0, senior: 0, pediatric: 0 },
    healthIndicators: {
      highHbA1c: 0,
      elevatedCreatinine: 0,
      longDiabetesDuration: 0,
      obesePatients: 0,
    },
  });

  useEffect(() => {
    setTitle("Patient Dashboard");
    const storedLogin = localStorage.getItem("medai-lastLogin");
    setLastLogin(
      storedLogin
        ? new Date(storedLogin).toLocaleString()
        : new Date().toLocaleString()
    );

    if (patients.length > 0) {
      const total = patients.length;

      // Age Demographics
      const ageGroups = patients.reduce(
        (acc, p) => {
          const age = parseFloat(p.age);
          if (age >= 65) acc.senior++;
          else if (age >= 18) acc.adult++;
          else acc.pediatric++;
          return acc;
        },
        { adult: 0, senior: 0, pediatric: 0 }
      );

      // Basic Stats
      const totalAge = patients.reduce((sum, p) => sum + parseFloat(p.age), 0);
      const totalHbA1c = patients.reduce(
        (sum, p) => sum + parseFloat(p.hba1c),
        0
      );
      const males = patients.filter((p) => p.patient_sex === "M").length;

      // Chronic Conditions
      const conditions = patients.reduce(
        (acc, p) => ({
          ckd: acc.ckd + p.ckd,
          cad: acc.cad + p.cad,
          hld: acc.hld + p.hld,
        }),
        { ckd: 0, cad: 0, hld: 0 }
      );

      // Health Risk Indicators
      const healthIndicators = patients.reduce(
        (acc, p) => {
          // Convert height from inches to meters
          const heightM = p.height * 0.0254;
          // Convert weight from pounds to kg
          const weightKg = p.weight * 0.453592;
          const bmi = weightKg / (heightM * heightM);

          if (parseFloat(p.hba1c) > 9) {
            acc.highHbA1c++;
          }
          if (parseFloat(p.creatine_mg_dl) > 1.2) {
            acc.elevatedCreatinine++;
          }
          if (p.duration > 120) {
            acc.longDiabetesDuration++; // 120 months = 10 years
          }
          if (bmi > 30) {
            acc.obesePatients++;
          }

          return acc;
        },
        {
          highHbA1c: 0,
          elevatedCreatinine: 0,
          longDiabetesDuration: 0,
          obesePatients: 0,
        }
      );

      setStats({
        totalPatients: total,
        averageAge: totalAge / total,
        averageHbA1c: totalHbA1c / total,
        genderDistribution: {
          male: (males / total) * 100,
          female: ((total - males) / total) * 100,
        },
        conditions: {
          ckd: (conditions.ckd / total) * 100,
          cad: (conditions.cad / total) * 100,
          hld: (conditions.hld / total) * 100,
        },
        demographics: {
          adult: (ageGroups.adult / total) * 100,
          senior: (ageGroups.senior / total) * 100,
          pediatric: (ageGroups.pediatric / total) * 100,
        },
        healthIndicators: {
          highHbA1c: (healthIndicators.highHbA1c / total) * 100,
          elevatedCreatinine:
            (healthIndicators.elevatedCreatinine / total) * 100,
          longDiabetesDuration:
            (healthIndicators.longDiabetesDuration / total) * 100,
          obesePatients: (healthIndicators.obesePatients / total) * 100,
        },
      });
    }
  }, [patients, setTitle]);

  if (loading) return <LoadingSpinner />;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Patient Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Last login: {lastLogin || "Loading..."}
            </p>
          </div>
          <div className="flex items-center space-x-4 w-96">
            <motion.div className="relative w-full">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients by name or MRN..."
              />

              {/* Search Results Dropdown */}
              {debouncedSearchTerm && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-gray-900 border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-gray-500">Loading patients...</div>
                  ) : error ? (
                    <div className="p-4 text-red-500">
                      Error loading patients: {error}
                    </div>
                  ) : patients.length === 0 ? (
                    <div className="p-4 text-gray-500">No patients found</div>
                  ) : (
                    patients.map((patient) => (
                      <Link
                        key={patient.id}
                        href={`/patient/${patient.id}`}
                        className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-600 border-b last:border-b-0 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-gray-400">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            MRN: {patient.medical_record_number} | Age:{" "}
                            {parseFloat(patient.age).toFixed(1)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.patient_sex}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<UserGroupIcon className="h-6 w-6 text-white" />}
            trendPositive={true}
            color="bg-medical-primary"
          />
          <StatsCard
            title="Average Age"
            value={stats.averageAge.toFixed(1)}
            icon={<CalendarIcon className="h-6 w-6 text-white" />}
            trendPositive={true}
            color="bg-green-500"
          />
          <StatsCard
            title="Avg HbA1c"
            value={stats.averageHbA1c.toFixed(1)}
            icon={<CurrencyDollarIcon className="h-6 w-6 text-white" />}
            trendPositive={true}
            color="bg-blue-500"
          />
          <StatsCard
            title="Gender Distribution"
            value={`M: ${stats.genderDistribution.male.toFixed(
              1
            )}% / F: ${stats.genderDistribution.female.toFixed(1)}%`}
            icon={<ScaleIcon className="h-6 w-6 text-white" />}
            color="bg-purple-500"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demographic Card */}
          <motion.div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
              <HeartIcon className="h-6 w-6 text-red-500" />
              Health Conditions
            </h3>
            <div className="space-y-4">
              <ConditionProgress
                label="Poor Glycemic Control (HbA1c > 9%)"
                value={stats.healthIndicators.highHbA1c}
                color="bg-red-500"
                threshold={9}
              />
              <ConditionProgress
                label="Elevated Creatinine (>1.2 mg/dL)"
                value={stats.healthIndicators.elevatedCreatinine}
                color="bg-orange-500"
                threshold={1.2}
              />
              <ConditionProgress
                label="Long Diabetes Duration (>10 years)"
                value={stats.healthIndicators.longDiabetesDuration}
                color="bg-blue-500"
                threshold={10}
              />
              <ConditionProgress
                label="Obesity (BMI > 30)"
                value={stats.healthIndicators.obesePatients}
                color="bg-purple-500"
                threshold={30}
              />
            </div>
          </motion.div>

          {/* Age Distribution Card */}
          <motion.div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 lg:col-span-2"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
                <CalendarIcon className="h-6 w-6 text-green-500" />
                Age Distribution
              </h3>
              <div className="flex gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Adults: {stats.demographics.adult.toFixed(1)}%
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Seniors: {stats.demographics.senior.toFixed(1)}%
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Pediatric: {stats.demographics.pediatric.toFixed(1)}%
                </span>
              </div>
            </div>
            <PatientChart patients={patients} />
          </motion.div>
        </div>

        {/* Patient List Table */}
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Recent Patients
            </h3>
            <div className="grid grid-cols-4 gap-4 font-medium text-gray-600 dark:text-gray-400 pb-2 border-b">
              <div>Name</div>
              <div>MRN</div>
              <div>Age</div>
              <div>Status</div>
            </div>
            {patients.slice(0, 5).map((patient) => (
              <Link
                key={patient.id}
                href={`/patient/${patient.id}`}
                className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-600 border-b last:border-b-0 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-gray-400">
                  {patient.name}
                </div>
                <div className="text-gray-900 dark:text-gray-400">
                  {patient.medical_record_number}
                </div>
                <div className="text-gray-900 dark:text-gray-400">
                  {parseFloat(patient.age).toFixed(1)}
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}

function ConditionProgress({ label, value, color }: ConditionProgressProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-medium dark:text-gray-400">
        <span>{label}</span>
        <span>{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
