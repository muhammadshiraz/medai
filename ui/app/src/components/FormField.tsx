// components/FormField.tsx
"use client";

interface FormFieldProps {
  label: string;
  value: string | number | Date;
  onChange: (value: string) => void;
  type?: "text" | "number" | "select" | "date" | "email";
  options?: string[];
  required?: boolean;
  step?: string;
  sub?: string;
  validate?: (value: string) => string | null;
  disabled?: boolean;
}

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  options,
  step,
  sub,
  disabled,
}: FormFieldProps) {
  const handleInputChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === "select" ? (
        <select
          value={value.toString()}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          required={required}
          disabled={disabled}
        >
          {options?.map((option) => (
            <option key={option} value={option}>
              {option || "Select"}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            type={type}
            value={
              value instanceof Date ? value.toISOString().split("T")[0] : value
            }
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required={required}
            step={step}
            disabled={disabled}
          />
          {sub && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              {sub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
