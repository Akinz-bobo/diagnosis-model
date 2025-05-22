"use client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AnalyticsActiveUsers() {
  // Mock data for daily active users
  const dailyData = [
    { date: "05/01", users: 120 },
    { date: "05/02", users: 132 },
    { date: "05/03", users: 145 },
    { date: "05/04", users: 140 },
    { date: "05/05", users: 158 },
    { date: "05/06", users: 142 },
    { date: "05/07", users: 135 },
    { date: "05/08", users: 148 },
    { date: "05/09", users: 152 },
    { date: "05/10", users: 159 },
    { date: "05/11", users: 162 },
    { date: "05/12", users: 155 },
    { date: "05/13", users: 172 },
    { date: "05/14", users: 160 },
  ];

  // Mock data for weekly active users
  const weeklyData = [
    { week: "W1 Apr", users: 185 },
    { week: "W2 Apr", users: 190 },
    { week: "W3 Apr", users: 198 },
    { week: "W4 Apr", users: 205 },
    { week: "W1 May", users: 210 },
    { week: "W2 May", users: 220 },
    { week: "W3 May", users: 225 },
    { week: "W4 May", users: 235 },
    { week: "W1 Jun", users: 245 },
  ];

  // Mock data for monthly active users
  const monthlyData = [
    { month: "Jan", users: 180 },
    { month: "Feb", users: 195 },
    { month: "Mar", users: 210 },
    { month: "Apr", users: 225 },
    { month: "May", users: 245 },
  ];

  return (
    <Tabs defaultValue="daily" className="space-y-4">
      <TabsList>
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>

      <TabsContent value="daily" className="space-y-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#14b8a6"
                name="Daily Active Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="weekly" className="space-y-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#14b8a6" name="Weekly Active Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="monthly" className="space-y-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#14b8a6"
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="Monthly Active Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  );
}
