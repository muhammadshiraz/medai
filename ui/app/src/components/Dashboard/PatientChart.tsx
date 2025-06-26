// src/components/Dashboard/PatientChart.tsx
"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { Patient } from "@/types/patient";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PatientChartProps {
  patients: Patient[];
}

// src/components/Dashboard/PatientChart.tsx
export default function PatientChart({ patients }: PatientChartProps) {
  // Month order for correct sorting
  const monthsOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const patientData = patients.reduce((acc, patient) => {
    const dateStr = patient.created_date;
    if (!dateStr) return acc;

    const isoDate = dateStr.replace(" ", "T");
    const date = new Date(isoDate);

    if (isNaN(date.getTime())) {
      console.warn("Invalid date:", dateStr);
      return acc;
    }

    const month = date.toLocaleString("en-US", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Create data for all months, filling in 0 for missing months
  const chartData = {
    labels: monthsOrder,
    datasets: [
      {
        label: "Patients Registered",
        data: monthsOrder.map((month) => patientData[month] || 0),
        borderColor: "#1E3A8A",
        backgroundColor: "#60A5FA",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Patient Registration Trends",
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                autoSkip: false,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                stepSize: 1,
              },
            },
          },
        }}
      />
    </div>
  );
}
