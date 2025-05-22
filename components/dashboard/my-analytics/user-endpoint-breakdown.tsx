"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export function UserEndpointBreakdown() {
  // Mock data - in a real app, this would come from your API
  const data = [
    { name: "Diagnosis API", value: 98 },
    { name: "Authentication", value: 32 },
    { name: "User Profile", value: 18 },
    { name: "File Upload", value: 8 },
  ];

  const COLORS = ["#14b8a6", "#0d9488", "#0f766e", "#115e59"];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-4 mt-4 w-full">
        {data.map((endpoint, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="text-sm">
              <span className="font-medium">{endpoint.name}:</span>{" "}
              {endpoint.value} calls
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
