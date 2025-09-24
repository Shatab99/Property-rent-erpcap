"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Building2, MessageSquare, UserCheck } from "lucide-react";

const statsData = [
  {
    title: "Total Users",
    value: "2,543",
    change: "+12.5%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Total Listings",
    value: "1,847",
    change: "+8.2%",
    icon: Building2,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Total Inquiries",
    value: "392",
    change: "+23.1%",
    icon: MessageSquare,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Active Agents",
    value: "47",
    change: "+5.3%",
    icon: UserCheck,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const monthlyData = [
  { name: "Jan", listings: 45, inquiries: 28 },
  { name: "Feb", listings: 52, inquiries: 35 },
  { name: "Mar", listings: 48, inquiries: 42 },
  { name: "Apr", listings: 61, inquiries: 38 },
  { name: "May", listings: 55, inquiries: 47 },
  { name: "Jun", listings: 67, inquiries: 52 },
];

const revenueData = [
  { name: "Jan", revenue: 45000 },
  { name: "Feb", revenue: 52000 },
  { name: "Mar", revenue: 48000 },
  { name: "Apr", revenue: 61000 },
  { name: "May", revenue: 55000 },
  { name: "Jun", revenue: 67000 },
];

const propertyTypeData = [
  { name: "Apartments", value: 45, fill: "#8884d8" },
  { name: "Houses", value: 32, fill: "#82ca9d" },
  { name: "Commercial", value: 15, fill: "#ffc658" },
  { name: "Land", value: 8, fill: "#ff7300" },
];

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your property management dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <Card key={stat.title} className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.color}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Activity */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="listings" fill="hsl(var(--primary))" name="New Listings" />
                <Bar dataKey="inquiries" fill="hsl(var(--accent))" name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Property Types */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Property Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    const { name, percent } = props;
                    return `${name} ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="admin-card xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "New property listing added",
                  user: "Sarah Johnson",
                  time: "2 hours ago",
                  type: "listing",
                },
                {
                  action: "User inquiry received",
                  user: "Michael Chen",
                  time: "4 hours ago",
                  type: "inquiry",
                },
                {
                  action: "Agent profile updated",
                  user: "Emma Wilson",
                  time: "6 hours ago",
                  type: "agent",
                },
                {
                  action: "Property status changed to sold",
                  user: "David Brown",
                  time: "1 day ago",
                  type: "listing",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.type === "listing" ? "bg-green-500" :
                        activity.type === "inquiry" ? "bg-blue-500" : "bg-purple-500"
                      }`} />
                    <div>
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}