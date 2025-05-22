"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function UserApiUsage() {
  const [timeRange, setTimeRange] = useState("30days");

  // Mock data - in a real app, this would come from your API
  const dailyData = [
    { date: "May 1", calls: 4, errors: 0 },
    { date: "May 2", calls: 6, errors: 0 },
    { date: "May 3", calls: 5, errors: 1 },
    { date: "May 4", calls: 8, errors: 0 },
    { date: "May 5", calls: 7, errors: 0 },
    { date: "May 6", calls: 3, errors: 0 },
    { date: "May 7", calls: 4, errors: 0 },
    { date: "May 8", calls: 9, errors: 1 },
    { date: "May 9", calls: 11, errors: 0 },
    { date: "May 10", calls: 8, errors: 0 },
    { date: "May 11", calls: 7, errors: 0 },
    { date: "May 12", calls: 6, errors: 1 },
    { date: "May 13", calls: 5, errors: 0 },
    { date: "May 14", calls: 4, errors: 0 },
    { date: "May 15", calls: 7, errors: 0 },
    { date: "May 16", calls: 8, errors: 0 },
    { date: "May 17", calls: 9, errors: 1 },
    { date: "May 18", calls: 10, errors: 0 },
    { date: "May 19", calls: 12, errors: 0 },
    { date: "May 20", calls: 11, errors: 0 },
    { date: "May 21", calls: 9, errors: 0 },
    { date: "May 22", calls: 8, errors: 1 },
    { date: "May 23", calls: 7, errors: 0 },
    { date: "May 24", calls: 6, errors: 0 },
    { date: "May 25", calls: 5, errors: 0 },
    { date: "May 26", calls: 4, errors: 0 },
    { date: "May 27", calls: 6, errors: 0 },
    { date: "May 28", calls: 7, errors: 1 },
    { date: "May 29", calls: 8, errors: 0 },
    { date: "May 30", calls: 9, errors: 0 },
  ];

  const weeklyData = [
    { date: "Week 1", calls: 37, errors: 1 },
    { date: "Week 2", calls: 45, errors: 2 },
    { date: "Week 3", calls: 55, errors: 1 },
    { date: "Week 4", calls: 39, errors: 1 },
  ];

  const monthlyData = [
    { date: "Jan", calls: 120, errors: 5 },
    { date: "Feb", calls: 145, errors: 6 },
    { date: "Mar", calls: 162, errors: 4 },
    { date: "Apr", calls: 158, errors: 7 },
    { date: "May", calls: 156, errors: 3 },
  ];

  const getData = () => {
    switch (timeRange) {
      case "7days":
        return dailyData.slice(-7);
      case "30days":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={getData()}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="calls"
            stroke="#14b8a6"
            name="API Calls"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="errors"
            stroke="#ef4444"
            name="Errors"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
