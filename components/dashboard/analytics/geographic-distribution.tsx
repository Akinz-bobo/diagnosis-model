"use client";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function AnalyticsGeographicDistribution() {
  // Mock data for geographic distribution
  const geographicData = [
    { name: "North America", value: 145, color: "#14b8a6" },
    { name: "Europe", value: 98, color: "#0ea5e9" },
    { name: "Asia", value: 56, color: "#8b5cf6" },
    { name: "South America", value: 24, color: "#f59e0b" },
    { name: "Africa", value: 12, color: "#ef4444" },
    { name: "Oceania", value: 7, color: "#84cc16" },
  ];

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={geographicData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {geographicData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
