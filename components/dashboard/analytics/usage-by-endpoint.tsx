"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AnalyticsUsageByEndpoint() {
  // Mock data for API usage by endpoint
  const endpointData = [
    {
      name: "/api/diagnose",
      calls: 580000,
      errors: 2900,
    },
    {
      name: "/api/pets",
      calls: 320000,
      errors: 1600,
    },
    {
      name: "/api/users",
      calls: 150000,
      errors: 750,
    },
    {
      name: "/api/breeds",
      calls: 95000,
      errors: 475,
    },
    {
      name: "/api/conditions",
      calls: 55000,
      errors: 275,
    },
  ];

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={endpointData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="calls" name="API Calls" fill="#14b8a6" />
          <Bar dataKey="errors" name="Errors" fill="#f43f5e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
