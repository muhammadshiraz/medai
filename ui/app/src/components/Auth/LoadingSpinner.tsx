"use client";

import { motion } from "framer-motion";

// src/components/Auth/LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 absolute left-0 right-0 top-0 bottom-0 z-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-12 w-12 border-4 border-medical-primary border-t-transparent rounded-full"
      />
    </div>
  );
}