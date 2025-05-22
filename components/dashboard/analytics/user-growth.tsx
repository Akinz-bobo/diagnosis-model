"use client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsUserGrowthProps {
  detailed?: boolean;
}

export function AnalyticsUserGrowth({
  detailed = false,
}: AnalyticsUserGrowthProps) {
  // Mock data for user growth
  const monthlyData = [
    { month: "Jan", users: 120, newUsers: 120 },
    { month: "Feb", users: 145, newUsers: 25 },
    { month: "Mar", users: 162, newUsers: 17 },
    { month: "Apr", users: 190, newUsers: 28 },
    { month: "May", users: 210, newUsers: 20 },
    { month: "Jun", users: 245, newUsers: 35 },
    { month: "Jul", users: 270, newUsers: 25 },
    { month: "Aug", users: 290, newUsers: 20 },
    { month: "Sep", users: 310, newUsers: 20 },
    { month: "Oct", users: 325, newUsers: 15 },
    { month: "Nov", users: 335, newUsers: 10 },
    { month: "Dec", users: 342, newUsers: 7 },
  ];

  if (detailed) {
    return (
      <div className="space-y-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#14b8a6"
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="Total Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="newUsers" name="New Users" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={monthlyData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#14b8a6"
            fillOpacity={1}
            fill="url(#colorUsers)"
            name="Total Users"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
