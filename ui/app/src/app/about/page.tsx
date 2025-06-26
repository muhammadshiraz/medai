// src/app/about/page.tsx
"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePageTitle } from "@/context/PageTitleContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
//import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("About MedicalHub");
  }, [setTitle]);

  return (
    <ProtectedRoute>
      <div className="w-full mx-auto p-6 max-w-4xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <nav className="mt-2 text-sm">
              <Link href="/" className="text-medical-primary hover:underline">
                Home
              </Link>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-gray-500">About</span>
            </nav>
            <h1 className="text-3xl font-bold mt-4 dark:text-gray-100">
              About MedicalHub
            </h1>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Mission Section */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              At MedicalHub, we are committed to revolutionizing healthcare
              management through innovative technology. Our platform empowers
              medical professionals to efficiently track patient data, monitor
              vital health metrics, and make informed clinical decisions.
            </p>
          </section>

          {/* Features Section */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: "❤️",
                  title: "Patient Monitoring",
                  description: "Real-time tracking of vital health metrics",
                },
                {
                  icon: "📊",
                  title: "Analytics Dashboard",
                  description: "Comprehensive data visualization tools",
                },
                {
                  icon: "🔒",
                  title: "Secure Storage",
                  description: "HIPAA-compliant data protection",
                },
                {
                  icon: "🔄",
                  title: "Automated Alerts",
                  description: "Smart notifications for critical values",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-medium dark:text-gray-100">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">
              Contact Us
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Have questions or feedback? We&apos;d love to hear from you.
              </p>
              {/* <Button
                asChild
                className="bg-medical-primary hover:bg-medical-primary-dark dark:bg-medical-primary-dark dark:hover:bg-medical-primary"
              >
                <Link href="mailto:support@medicalhub.com">
                  Contact Support
                </Link>
              </Button> */}
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
