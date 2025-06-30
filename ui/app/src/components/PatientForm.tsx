// components/PatientForm.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Patient } from "@/types/patient";
import FormField from "@/components/FormField";
import { PatientService } from "@/lib/api/patientService";
import toast from "react-hot-toast";

interface FormReading {
  id?: number;
  time: string;
  value: string;
  date: string;
}

interface FormRecommendation {
  id?: number;
  patient_id?: number;
  drug_id?: number;
  time_of_reading: string;
  dosage?: number;
  dosage_unit?: string;
  recommendation_date?: string;
}
interface FormMedication {
  id?: number;
  patient_id?: number;
  drug_id?: number;
  dosage?: number;
  dosage_unit?: string;
}

interface FormInsulin {
  drug: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  bedtime: string;
}

export default function PatientForm({
  initialData,
}: {
  initialData?: Patient;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Patient>>(initialData || {});
  const [readings, setReadings] = useState<FormReading[]>([]);
  const [medications, setMedications] = useState<FormMedication[]>([]);
  const [recommendations, setRecommendations] = useState<FormRecommendation[]>(
    []
  );
  const [insulinData, setInsulinData] = useState<FormInsulin[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Initialize blood sugar readings
  useEffect(() => {
    if (initialData?.latestReadings) {
      const readingsArray = initialData.latestReadings.map((reading) => ({
        id: reading.id,
        time: reading.time_of_reading,
        value: reading.reading_value.toString(),
        date: reading.reading_date,
      }));
      setReadings(readingsArray);
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
            date: reading.reading_date,
          }))
        );
      }

      // Initialize medications
      if (initialData?.medications) {
        setMedications(
          initialData.medications.map((med) => ({
            id: med.id,
            patient_id: med.patient_id,
            drug_id: med.drug_id,
            dosage: med.dosage,
            dosage_unit: med.dosage_unit,
          }))
        );
      }

      // Initialize recommendations
      if (initialData?.recommendations) {
        setRecommendations(
          initialData.recommendations.map((med) => ({
            id: med.id,
            patient_id: med.patient_id,
            drug_id: med.drug_id,
            dosage: med.dosage,
            dosage_unit: med.dosage_unit || "unit",
            time_of_reading: med.time_of_reading || "",
            recommendation_date: med.recommendation_date || "",
          }))
        );
      }

      // Initialize insulin data
      if (initialData?.insulinData) {
        setInsulinData(
          initialData.insulinData.map((insulin) => ({
            drug: insulin.drug || "",
            breakfast: insulin.breakfast === "-" ? "" : insulin.breakfast,
            lunch: insulin.lunch === "-" ? "" : insulin.lunch,
            dinner: insulin.dinner === "-" ? "" : insulin.dinner,
            bedtime: insulin.bedtime === "-" ? "" : insulin.bedtime,
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...patientData } = formData;
      console.log(medications, insulinData, readings);

      const payload = {
        ...formData,
        hba1c: formData.hba1c ? Number(formData.hba1c).toFixed(2) : undefined,
        //creatine_mg_dl: formData.creatine_mg_dl
        // ? Number(formData.creatine_mg_dl).toFixed(4)
        //  : undefined,
        //age: undefined, // Age is not needed for insert
        cad: formData.cad || 0,
        ckd: formData.ckd || 0,
        hld: formData.hld || 0,
        duration: formData.duration || 0,
        medications: medications || [],
        insulinData: insulinData || [],
        latestReadings: readings || [],
      };
      if (!initialData?.id) {
        //throw new Error("Patient ID missing " + JSON.stringify(initialData));
        console.log("Inserting new patient with payload:", payload);
        // Insert new patient using the payload
        const newPatient = await PatientService.insertPatient(
          payload as Patient
        );
        // Optionally update formData with new patient data (e.g., id)
        setFormData(newPatient);
        toast.success("Patient created successfully! inserted", {
          icon: "✅",
          position: "top-right",
          style: {
            background: "#f0fff4",
            color: "#38a169",
            padding: "16px",
            borderRadius: "8px",
          },
        });
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
        router.push(`/patients`);
        router.refresh();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Submission error:", err);
      // Extract error message from API response
      const apiError =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";

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

  const handleReadingChange = (time: string, value: string, date: string) => {
    setReadings((prev) => [
      ...prev.filter((r) => r.time !== time),
      {
        ...(prev.find((r) => r.time === time) || { time }),
        value,
        date,
      },
    ]);
  };

  const handleMedicationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setMedications((prev) => {
      const newMedications = [...prev];
      newMedications[index] = { ...newMedications[index], [field]: value };
      return newMedications;
    });
  };

  const addMedication = () => {
    setMedications((prev) => [
      ...prev,
      //{
      //  drug: "",
      //  time_of_reading: "",
      //},
    ]);
  };

  const handleRecommendationsChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setRecommendations((prev) => {
      const newRecommendations = [...prev];
      newRecommendations[index] = {
        ...newRecommendations[index],
        [field]: value,
      };
      return newRecommendations;
    });
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
                {/*<FormField
                  label={`Date for ${time}`}
                  type="date"
                  value={reading?.date || ""}
                  onChange={(v) =>
                    handleReadingChange(time, reading?.value || "", v)
                  }
                />*/}
                <FormField
                  label={`Before ${
                    time.charAt(0).toUpperCase() + time.slice(1)
                  }`}
                  type="number"
                  value={reading?.value || ""}
                  onChange={(v) =>
                    handleReadingChange(
                      time,
                      v,
                      reading?.date || new Date().toISOString().split("T")[0]
                    )
                  }
                  sub="mg/dL"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Medications Section */}
      <div
        className={`bg-white dark:bg-gray-900 p-6 rounded-xl shadow ${
          initialData === undefined ? "hidden" : "block"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Medications</h2>
          <button
            type="button"
            onClick={addMedication}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hidden"
          >
            Add Medication
          </button>
        </div>
        <div className="space-y-4">
          {medications.map((med, index) => (
            <div
              key={`med-${index}-${med.drug_id ?? "none"}`}
              className="grid grid-cols-4 gap-4 items-end"
            >
              <FormField
                label="Drug Name"
                type="select"
                options={[
                  "Metformin",
                  "Glimepiride",
                  "Tradjenta",
                  "Glargine",
                  "Lispro",
                  "Farxiga",
                  "Ozempic",
                ]}
                value={
                  med.drug_id
                    ? [
                        "Metformin",
                        "Glimepiride",
                        "Tradjenta",
                        "Glargine",
                        "Lispro",
                        "Farxiga",
                        "Ozempic",
                      ][Number(med.drug_id) - 1]
                    : ""
                }
                onChange={(v) =>
                  handleMedicationChange(
                    index,
                    "drug_id",
                    [
                      "Metformin",
                      "Glimepiride",
                      "Tradjenta",
                      "Glargine",
                      "Lispro",
                      "Farxiga",
                      "Ozempic",
                    ].indexOf(v) + 1
                  )
                }
                disabled={initialData !== undefined}
              />
              <FormField
                label="Dosage"
                value={med.dosage || ""}
                onChange={(v) => handleMedicationChange(index, "dosage", v)}
                //sub="mg"
                disabled={initialData !== undefined}
              />
              <FormField
                label="Units"
                type="select"
                options={["mg", "mcg", "ml", "unit", "g", "kg", "l", "oz"]}
                value={med.dosage_unit || "unit"}
                onChange={(v) =>
                  handleMedicationChange(index, "dosage_unit", v)
                }
                disabled={initialData !== undefined}
              />
            </div>
          ))}
        </div>
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
          onClick={() =>
            setInsulinData((prev) => [
              ...prev,
              {
                drug: "Lispro",
                breakfast: "0",
                lunch: "0",
                dinner: "0",
                bedtime: "0",
              },
            ])
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hidden"
        >
          Add Insulin
        </button>
        <div className="space-y-4">
          {insulinData.map((insulin, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-end">
              <FormField
                label="Insulin Type"
                type="select"
                options={[
                  "Metformin",
                  "Glimepiride",
                  "Tradjenta",
                  "Glargine",
                  "Lispro",
                  "Farxiga",
                  "Ozempic",
                ]}
                value={insulin.drug || "Lispro"}
                onChange={(v) =>
                  setInsulinData((prev) => {
                    const newData = [...prev];
                    newData[index].drug = v;
                    return newData;
                  })
                }
                disabled={initialData !== undefined}
              />
              <FormField
                label="Breakfast"
                value={insulin.breakfast}
                onChange={(v) =>
                  setInsulinData((prev) => {
                    const newData = [...prev];
                    newData[index].breakfast = v;
                    return newData;
                  })
                }
                //sub="units"
                disabled={initialData !== undefined}
              />
              <FormField
                label="Lunch"
                value={insulin.lunch}
                onChange={(v) =>
                  setInsulinData((prev) => {
                    const newData = [...prev];
                    newData[index].lunch = v;
                    return newData;
                  })
                }
                //sub="units"
                disabled={initialData !== undefined}
              />
              <FormField
                label="Dinner"
                value={insulin.dinner}
                onChange={(v) =>
                  setInsulinData((prev) => {
                    const newData = [...prev];
                    newData[index].dinner = v;
                    return newData;
                  })
                }
                //sub="units"
                disabled={initialData !== undefined}
              />
              <FormField
                label="Bedtime"
                value={insulin.bedtime}
                onChange={(v) =>
                  setInsulinData((prev) => {
                    const newData = [...prev];
                    newData[index].bedtime = v;
                    return newData;
                  })
                }
                //sub="units"
                disabled={initialData !== undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recommendations</h2>
        </div>
        <div className="space-y-4">
          {recommendations.map((med, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-end">
              <FormField
                label="Drug Name"
                value={med.drug_id}
                onChange={(v) => handleRecommendationsChange(index, "drug", v)}
                disabled={initialData !== undefined}
              />
              <FormField
                label="Breakfast"
                value={med.time_of_reading == "breakfast" ? med.dosage : ""}
                onChange={(v) =>
                  handleRecommendationsChange(index, "breakfast", v)
                }
                //sub="mg"
                disabled={initialData !== undefined}
              />
              <FormField
                label="Lunch"
                value={med.time_of_reading == "lunch" ? med.dosage : ""}
                onChange={(v) => handleRecommendationsChange(index, "lunch", v)}
                //sub="mg"
                disabled={initialData !== undefined}
              />
              <FormField
                label="Dinner"
                value={med.time_of_reading == "dinner" ? med.dosage : ""}
                onChange={(v) =>
                  handleRecommendationsChange(index, "dinner", v)
                }
                //sub="mg"
                disabled={initialData !== undefined}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={() => router.back()}
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
