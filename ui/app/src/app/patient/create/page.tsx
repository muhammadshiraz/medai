// app/patient/create/page.tsx
"use client";
import { useEffect } from "react";
import { usePageTitle } from "@/context/PageTitleContext";
import PatientForm from "@/components/PatientForm";

export default function CreatePatient() {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("New Patient Registration");
  }, [setTitle]);

  return (
    <div className="max-w-7xl mx-auto">
      <PatientForm />
    </div>
  );
}