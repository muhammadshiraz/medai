// components/PatientForm.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Patient } from "@/types/patient";
import FormField from "@/components/FormField";
import { PatientService } from "@/lib/api/patientService";
import { BloodSugarService } from "@/lib/api/bloodSugarService";
import toast from "react-hot-toast";

interface FormReading {
  id?: number;
  time: string;
  value: string;
}

export default function PatientForm({
  initialData,
}: {
  initialData?: Patient;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Patient>>(initialData || {});
  const [readings, setReadings] = useState<FormReading[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Initialize blood sugar readings
  useEffect(() => {
    if (initialData?.latestReadings) {
      setReadings(
        initialData.latestReadings.map((reading) => ({
          id: reading.id,
          time: reading.time_of_reading,
          value: reading.reading_value.toString(),
        }))
      );
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);

      // Initialize readings
      if (initialData.latestReadings) {
        setReadings(
          initialData.latestReadings.map((reading) => ({
            id: reading.id,
            time: reading.time_of_reading,
            value: reading.reading_value.toString(),
          }))
        );
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        hba1c: formData.hba1c ? Number(formData.hba1c).toFixed(2) : undefined,
        cad: formData.cad || 0,
        ckd: formData.ckd || 0,
        hld: formData.hld || 0,
        duration: formData.duration || 0,
        readings: readings.map((r) => ({
          time: r.time,
          value: r.value,
        })),
      };
      if (!initialData?.id) {
        console.log("Inserting new patient with payload:", payload);
        // Insert new patient using the payload
        const newPatient = await PatientService.insertPatient(
          payload as Patient
        );
        // Optionally update formData with new patient data (e.g., id)
        setFormData(newPatient);

        // Use Promise.all to wait for all readings to be saved
        const readingPromises = readings.map(async (reading) => {
          const readingPayload = {
            patient_id: newPatient.id,
            time_of_reading: reading.time,
            reading_value: Number(reading.value),
            notes: "",
          };

          const savedReading = await BloodSugarService.createReading(
            readingPayload
          );
          return savedReading; // Return the saved reading
        });

        // Wait for all readings to be saved
        await Promise.all(readingPromises);
        toast.success("Patient created successfully!", {
          icon: "✅",
          position: "top-right",
          style: {
            background: "#f0fff4",
            color: "#38a169",
            padding: "16px",
            borderRadius: "8px",
          },
        });

        router.push(`/patients?id=${newPatient.id}&label=${formData.name}`);
        router.refresh();
        return newPatient;
      } else {
        console.log("Updating existing patient with payload:", payload);
        const patientId = initialData.id;

        await PatientService.updatePatient(patientId, payload as Patient);

        toast.success("Patient updated successfully!", {
          icon: "✅",
          position: "top-right",
          style: {
            background: "#f0fff4",
            color: "#38a169",
            padding: "16px",
            borderRadius: "8px",
          },
        });

        // router.push(`/patient/${patientId}`);
        router.push(`/patients?id=${formData.id}&label=${formData.name}`);
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Submission error:", err);
      // Extract error message from API response
      const apiError =
        err instanceof Error ? err.message : "An unknown error occurred";

      setError(apiError);

      // Show toast notification
      toast.error(`Operation failed: ${apiError}`, {
        icon: "❌",
        position: "top-right",
        style: {
          background: "#fff5f5",
          color: "#e53e3e",
          padding: "16px",
          borderRadius: "8px",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const validateForm = () => {
      const errors = [];
      if (!formData.name) {
        errors.push("Name is required");
      }
      if (!formData.birth_date) {
        errors.push("Birth date is required");
      }
      if (formData.weight && formData.weight < 0) {
        errors.push("Invalid weight");
      }

      if (errors.length > 0) {
        setError(errors.join(", "));
      } else {
        setError("");
      }
    };

    validateForm();
  }, [formData]);

  const handleChange = (field: keyof Patient, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReadingChange = (time: string, value: string) => {
    setReadings((prev) => [
      ...prev.filter((r) => r.time !== time),
      { time, value },
    ]);
  };

  const bmi =
    formData.height && formData.weight
      ? (formData.weight / (formData.height / 100) ** 2).toFixed(1)
      : "-";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && <div className="p-4 text-red-500">{error}</div>}

      {/* Patient Header Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        {/* Image Upload */}
        <div className="col-span-1 flex flex-col items-center">
          <div className="mb-4 relative group">
            <img
              src={
                formData.patient_sex === "F"
                  ? "/patient-details/female.svg"
                  : "/patient-details/male.svg"
              }
              alt="Patient"
              className="w-32 h-32 rounded-full border-4 border-blue-200"
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="col-span-3 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              label="Full Name"
              value={formData.name || ""}
              onChange={(v) => handleChange("name", v)}
              required
            />
            <FormField
              label="Birth Date"
              type="date"
              value={formData.birth_date || ""}
              onChange={(v) => handleChange("birth_date", v)}
              required
            />
            <FormField
              label="Gender"
              type="select"
              options={["M", "F"]}
              value={formData.patient_sex || ""}
              onChange={(v) => handleChange("patient_sex", v)}
              required
            />
            <FormField
              label="Weight (kg)"
              type="number"
              value={formData.weight || ""}
              onChange={(v) => handleChange("weight", Number(v))}
            />
            <FormField
              label="Height (cm)"
              type="number"
              value={formData.height || ""}
              onChange={(v) => handleChange("height", Number(v))}
            />
            <div className="bg-gray-100 p-4 rounded-lg">
              <span className="font-medium">BMI: {bmi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-6">Medical Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              label="HbA1c (%)"
              type="number"
              step="0.1"
              value={formData.hba1c || ""}
              onChange={(v) => handleChange("hba1c", v)}
              validate={(v) => {
                const value = parseFloat(v);
                if (value < 4 || value > 20) {
                  return "Must be between 4-20%";
                }
                return null;
              }}
            />
            <FormField
              label="Creatinine (mg/dL)"
              type="number"
              step="0.01"
              value={formData.creatine_mg_dl || ""}
              onChange={(v) => handleChange("creatine_mg_dl", Number(v))}
            />
          </div>
          <div className="space-y-4">
            <FormField
              label="Duration (years)"
              type="number"
              value={formData.duration || ""}
              onChange={(v) => handleChange("duration", Number(v))}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                label="CAD"
                type="select"
                options={["No", "Yes"]}
                value={formData.cad === 1 ? "Yes" : "No"}
                onChange={(v) => handleChange("cad", v === "Yes" ? 1 : 0)}
              />
              <FormField
                label="CKD"
                type="select"
                options={["No", "Yes"]}
                value={formData.ckd === 1 ? "Yes" : "No"}
                onChange={(v) => handleChange("ckd", v === "Yes" ? 1 : 0)}
              />
              <FormField
                label="HLD"
                type="select"
                options={["No", "Yes"]}
                value={formData.hld === 1 ? "Yes" : "No"}
                onChange={(v) => handleChange("hld", v === "Yes" ? 1 : 0)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Blood Sugar Readings */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-6">Blood Sugar Readings</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["breakfast", "lunch", "dinner", "bedtime"].map((time) => {
            const reading = readings.find((r) => r.time === time);
            return (
              <div key={time} className="space-y-2">
                <FormField
                  label={`Before ${
                    time.charAt(0).toUpperCase() + time.slice(1)
                  }`}
                  type="number"
                  value={reading?.value || ""}
                  onChange={(v) => handleReadingChange(time, v)}
                  sub="mg/dL"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Medications Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow block">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Recommendations / Medications
          </h2>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hidden"
          >
            Add Medication
          </button>
        </div>
        <div className="space-y-4"></div>
      </div>

      {/* Insulin Section */}
      <div
        className={`bg-white dark:bg-gray-900 p-6 rounded-xl shadow ${
          initialData === undefined ? "hidden" : "block"
        }`}
      >
        <h2 className="text-xl font-semibold mb-6">Insulin</h2>
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hidden"
        >
          Add Insulin
        </button>
        <div className="space-y-4"></div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={() => router.push("/patients")}
          className="px-6 py-2 border rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          {isSubmitting ? "Saving..." : "Save Patient"}
        </button>
      </div>
    </form>
  );
}
