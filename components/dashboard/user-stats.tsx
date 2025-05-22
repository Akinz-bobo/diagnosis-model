"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export function UserStats() {
  const registrationData = [
    { name: "Jan", users: 12 },
    { name: "Feb", users: 19 },
    { name: "Mar", users: 25 },
    { name: "Apr", users: 32 },
    { name: "May", users: 38 },
    { name: "Jun", users: 42 },
    { name: "Jul", users: 48 },
    { name: "Aug", users: 53 },
    { name: "Sep", users: 61 },
    { name: "Oct", users: 68 },
    { name: "Nov", users: 74 },
    { name: "Dec", users: 82 },
  ];

  const activityData = [
    { name: "Mon", active: 120 },
    { name: "Tue", active: 145 },
    { name: "Wed", active: 162 },
    { name: "Thu", active: 158 },
    { name: "Fri", active: 142 },
    { name: "Sat", active: 98 },
    { name: "Sun", active: 85 },
  ];

  const roleData = [
    { name: "Users", value: 320 },
    { name: "Admins", value: 22 },
  ];

  const COLORS = ["#14b8a6", "#0d9488"];

  return (
    <Tabs defaultValue="registrations" className="space-y-4">
      <TabsList>
        <TabsTrigger value="registrations">Registrations</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
      </TabsList>

      <TabsContent value="registrations">
        <Card>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={registrationData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#14b8a6"
                  activeDot={{ r: 8 }}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity">
        <Card>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={activityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" fill="#14b8a6" name="Active Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="roles">
        <Card>
          <CardContent className="pt-6 flex justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {roleData.map((entry, index) => (
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
      </TabsContent>
    </Tabs>
  );
}
