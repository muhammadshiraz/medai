export default function MetricItem({
  label,
  value,
  unit,
  status,
}: {
  label: string;
  value: string | number;
  unit?: string;
  status: "high" | "normal" | "neutral";
}) {
  const statusColors = {
    high: "text-red-600",
    normal: "text-green-600",
    neutral: "text-gray-600",
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-600 p-3 rounded-lg">
      <div className="text-xs text-gray-500 dark:text-gray-200 mb-1">{label}</div>
      <div className={`flex items-baseline ${statusColors[status]}`}>
        <span className="text-lg font-semibold dark:text-gray-200">{value}</span>
        {unit && <span className="text-sm ml-1 dark:text-gray-200">{unit}</span>}
      </div>
    </div>
  );
}
