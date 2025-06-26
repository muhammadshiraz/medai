// src/components/Layout/ClientLayout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";
import { motion } from "framer-motion";

const DynamicHeader = dynamic(() => import("@/components/Layout/Header"), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900" />,
});
const DynamicSidebar = dynamic(() => import("@/components/Layout/Sidebar"), {
  ssr: false,
  loading: () => <div className="w-64 bg-white dark:bg-gray-900" />,
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      {isAuthenticated && <DynamicSidebar />}
      <div className={`flex-1 ${isAuthenticated ? "lg:pl-64" : ""}`}>
        {isAuthenticated && <DynamicHeader />}
        <main className={`p-6 min-h-screen bg-white dark:bg-gray-900 ${isAuthenticated ? "mt-14" : ""}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            key={isAuthenticated ? "authenticated" : "guest"}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
