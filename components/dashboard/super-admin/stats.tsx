"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend,
} from "recharts";

export function SuperAdminStats() {
  const userGrowthData = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 145 },
    { month: "Mar", users: 162 },
    { month: "Apr", users: 190 },
    { month: "May", users: 210 },
    { month: "Jun", users: 245 },
    { month: "Jul", users: 270 },
    { month: "Aug", users: 290 },
    { month: "Sep", users: 310 },
    { month: "Oct", users: 325 },
    { month: "Nov", users: 335 },
    { month: "Dec", users: 342 },
  ];

  const apiUsageData = [
    { name: "Mon", calls: 1200 },
    { name: "Tue", calls: 1450 },
    { name: "Wed", calls: 1620 },
    { name: "Thu", calls: 1580 },
    { name: "Fri", calls: 1420 },
    { name: "Sat", calls: 980 },
    { name: "Sun", calls: 850 },
  ];

  const subscriptionData = [
    { name: "Free", value: 250 },
    { name: "Pro", value: 80 },
    { name: "Enterprise", value: 12 },
  ];

  const COLORS = ["#0088FE", "#14b8a6", "#FF8042"];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>
            Total user growth over the past year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#14b8a6"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>API calls over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={apiUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Distribution</CardTitle>
          <CardDescription>Distribution of subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriptionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {subscriptionData.map((entry, index) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
