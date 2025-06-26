"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  LockClosedIcon,
  UserCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      await login(data.username, data.password);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace("/search-patient");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-medical-primary to-blue-600 relative">
        <div className="absolute inset-0 bg-[url('/medical-ai-concept.jpg')] bg-cover bg-center opacity-90" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* <Image
              src="/medai_logo.png"
              alt="MedAI Logo"
              width={120}
              height={40}
              className="h-10 mb-8 w-auto"
            /> */}
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md"
          >
            <h1 className="text-4xl font-bold mb-4">
              Smart Healthcare Powered by AI
            </h1>
            <p className="text-lg opacity-90">
              Experience personalized healthcare services in your native
              language through our advanced artificial intelligence platform.
            </p>
          </motion.div>
          <div className="flex gap-4 mt-8">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-12 h-12 dark:bg-gray-900/10 rounded-lg flex items-center justify-center"
              >
                <Image
                  src={`/health-icons/icon-${i + 1}.svg`}
                  alt={`Feature ${i + 1}`}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 bg-white dark:bg-gray-900 flex items-center justify-center p-8"
      >
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              src="/medai_logo.png"
              className="h-12 mx-auto mb-6"
              alt="Healthcare Logo"
            />
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-400">
                Welcome to MedAI
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to your personalized healthcare portal
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserCircleIcon
                    className={`h-5 w-5 transition-colors ${
                      errors.username
                        ? "text-red-500"
                        : "text-gray-400 group-focus-within:text-medical-primary"
                    }`}
                  />
                </div>
                <input
                  {...register("username")}
                  type="text"
                  className={`w-full pl-10 pr-3 py-3 dark:bg-gray-900 dark:text-gray-300 rounded-lg border transition-all ${
                    errors.username
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:border-medical-primary focus:ring-medical-primary"
                  } focus:ring-2 placeholder-gray-400`}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <LockClosedIcon
                    className={`h-5 w-5 transition-colors ${
                      errors.password
                        ? "text-red-500"
                        : "text-gray-400 group-focus-within:text-medical-primary"
                    }`}
                  />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg dark:bg-gray-900 dark:text-gray-300 border transition-all ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:border-medical-primary focus:ring-medical-primary"
                  } focus:ring-2 placeholder-gray-400`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-medical-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-medical-primary to-blue-600 hover:from-blue-600 hover:to-medical-primary text-white rounded-lg transition-all disabled:opacity-50 flex justify-center items-center shadow-lg hover:shadow-medical-primary/20"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : null}
              {isSubmitting ? "Authenticating..." : "Sign In"}
            </motion.button>

            <div className="text-center text-sm">
              <a
                href="#"
                className="font-medium text-medical-primary hover:text-blue-600 transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
