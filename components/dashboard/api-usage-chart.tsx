"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ApiUsageChartProps {
  detailed?: boolean;
}

export function ApiUsageChart({ detailed = false }: ApiUsageChartProps) {
  const data = [
    {
      name: "Jan",
      total: 420,
    },
    {
      name: "Feb",
      total: 362,
    },
    {
      name: "Mar",
      total: 510,
    },
    {
      name: "Apr",
      total: 602,
    },
    {
      name: "May",
      total: 734,
    },
    {
      name: "Jun",
      total: 821,
    },
    {
      name: "Jul",
      total: 948,
    },
    {
      name: "Aug",
      total: 1024,
    },
    {
      name: "Sep",
      total: 1186,
    },
    {
      name: "Oct",
      total: 1298,
    },
    {
      name: "Nov",
      total: 1420,
    },
    {
      name: "Dec",
      total: 1570,
    },
  ];

  const detailedData = [
    {
      name: "1",
      diagnosis: 23,
      auth: 12,
    },
    {
      name: "2",
      diagnosis: 18,
      auth: 8,
    },
    {
      name: "3",
      diagnosis: 25,
      auth: 10,
    },
    {
      name: "4",
      diagnosis: 31,
      auth: 15,
    },
    {
      name: "5",
      diagnosis: 28,
      auth: 12,
    },
    {
      name: "6",
      diagnosis: 19,
      auth: 9,
    },
    {
      name: "7",
      diagnosis: 22,
      auth: 11,
    },
    {
      name: "8",
      diagnosis: 35,
      auth: 14,
    },
    {
      name: "9",
      diagnosis: 42,
      auth: 16,
    },
    {
      name: "10",
      diagnosis: 38,
      auth: 13,
    },
    {
      name: "11",
      diagnosis: 29,
      auth: 10,
    },
    {
      name: "12",
      diagnosis: 33,
      auth: 12,
    },
    {
      name: "13",
      diagnosis: 27,
      auth: 9,
    },
    {
      name: "14",
      diagnosis: 31,
      auth: 11,
    },
    {
      name: "15",
      diagnosis: 36,
      auth: 14,
    },
    {
      name: "16",
      diagnosis: 42,
      auth: 16,
    },
    {
      name: "17",
      diagnosis: 38,
      auth: 13,
    },
    {
      name: "18",
      diagnosis: 29,
      auth: 10,
    },
    {
      name: "19",
      diagnosis: 33,
      auth: 12,
    },
    {
      name: "20",
      diagnosis: 27,
      auth: 9,
    },
    {
      name: "21",
      diagnosis: 31,
      auth: 11,
    },
    {
      name: "22",
      diagnosis: 36,
      auth: 14,
    },
    {
      name: "23",
      diagnosis: 42,
      auth: 16,
    },
    {
      name: "24",
      diagnosis: 38,
      auth: 13,
    },
    {
      name: "25",
      diagnosis: 29,
      auth: 10,
    },
    {
      name: "26",
      diagnosis: 33,
      auth: 12,
    },
    {
      name: "27",
      diagnosis: 27,
      auth: 9,
    },
    {
      name: "28",
      diagnosis: 31,
      auth: 11,
    },
    {
      name: "29",
      diagnosis: 36,
      auth: 14,
    },
    {
      name: "30",
      diagnosis: 42,
      auth: 16,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={detailed ? 400 : 250}>
      {detailed ? (
        <BarChart data={detailedData}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip />
          <Bar
            dataKey="diagnosis"
            fill="#2b95ea"
            radius={[4, 4, 0, 0]}
            name="Diagnosis API"
          />
          <Bar
            dataKey="auth"
            fill="#1978c5"
            radius={[4, 4, 0, 0]}
            name="Auth API"
          />
        </BarChart>
      ) : (
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Bar dataKey="total" fill="#2b95ea" radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}
