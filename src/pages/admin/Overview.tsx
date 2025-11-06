"use client";
import { useEffect, useState } from "react";
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
import { Users, Building2, MessageSquare, UserCheck, Globe, Smartphone, Clock } from "lucide-react";
import api from "@/lib/baseurl";

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

const COLORS = ["#3b82f6", "#f97316", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#6366f1", "#d946ef"];

export default function Overview() {
  const [statsData, setStatsData] = useState<any[]>([]);
  const [propertyTypeData, setPropertyTypeData] = useState<any[]>([]);
  const [trafficData, setTrafficData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '' : '';

        // Fetch admin stats
        const statsResponse = await api.get("/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statsResponse.data.success) {
          const { userStats, propertyStats } = statsResponse.data.data;

          // Build stats cards
          const totalUsers = userStats.tenantCount + userStats.agentCount + userStats.landlordCount;
          const stats = [
            {
              title: "Total Users",
              value: totalUsers.toString(),
              change: `Tenants: ${userStats.tenantCount}`,
              icon: Users,
              color: "text-blue-600",
              bgColor: "bg-blue-50",
            },
            {
              title: "Total Listings",
              value: propertyStats.activeListings.toString(),
              change: "Active properties",
              icon: Building2,
              color: "text-green-600",
              bgColor: "bg-green-50",
            },
            {
              title: "Total Agents",
              value: userStats.agentCount.toString(),
              change: `Pending: ${userStats.pendingAgentCount}, Rejected: ${userStats.rejectedAgentCount}`,
              icon: UserCheck,
              color: "text-purple-600",
              bgColor: "bg-purple-50",
            },
            {
              title: "Total Landlords",
              value: userStats.landlordCount.toString(),
              change: "Property owners",
              icon: MessageSquare,
              color: "text-orange-600",
              bgColor: "bg-orange-50",
            },
          ];
          setStatsData(stats);

          // Build pie chart data from propertyStats
          const pieData = propertyStats.pieChart.map((item: any, index: number) => {
            // Determine color based on status
            let color = COLORS[index % COLORS.length];
            if (item.mlsStatus === "Active") {
              color = "#10b981"; // Green for Active
            }
            return {
              name: item.mlsStatus,
              value: item.count,
              fill: color,
            };
          });
          setPropertyTypeData(pieData);
        }

        // Fetch today's traffic stats
        const trafficResponse = await api.get("/admin/todays-traffic-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (trafficResponse.data.success) {
          setTrafficData(trafficResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your admin dashboard
          </p>
        </div>

        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="admin-card">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                  <div className="h-8 bg-muted rounded w-16 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Loading State */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="admin-card">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-40 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Row Loading State */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="admin-card">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-40 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsData && statsData.map((stat) => (
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
                <Bar dataKey="listings" fill="#2253C3" name="New Listings" />
                <Bar dataKey="inquiries" fill="#2253C3" name="Inquiries" />
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
                  stroke="#2253C3"
                  strokeWidth={3}
                  dot={{ fill: "#2253C3" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Property Types */}
        <Card className="admin-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Property Status Distribution</CardTitle>
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {propertyTypeData && propertyTypeData.length > 0 ? propertyTypeData.reduce((sum: number, d: any) => sum + d.value, 0) : 0} Total
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {propertyTypeData && propertyTypeData.length > 0 ? (
              <div className="flex flex-col gap-6">
                {/* Pie Chart */}
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={propertyTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props: any) => {
                          const { percent } = props;
                          return percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : '';
                        }}
                        outerRadius={90}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {propertyTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => {
                          const payload = props.payload;
                          return [`${payload.value} properties`, payload.name];
                        }}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '8px 12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend - Flex Wrap */}
                <div className="flex flex-wrap gap-3 justify-center">
                  {propertyTypeData.map((item: any, index: number) => {
                    const total = propertyTypeData.reduce((sum: number, d: any) => sum + d.value, 0);
                    const percentage = ((item.value / total) * 100).toFixed(1);
                    return (
                      <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-muted flex-shrink-0">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm"
                          style={{ backgroundColor: item.fill }}
                        />
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                            {item.value}
                          </p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                            {percentage}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">No property data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Today&apos;s Traffic
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{trafficData?.date || 'Loading...'}</p>
          </CardHeader>
          <CardContent>
            {trafficData ? (
              <>
                {/* Traffic Summary Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground font-medium">Total Visitors</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">{trafficData?.uniqueIPCount || 0}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground font-medium">Domain Trafic</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{trafficData?.totalVisitors || 0}</p>
                  </div>

                </div>

                {/* Visitors List - Scrollable */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Visitor Details</h3>
                  <div className="h-96 overflow-y-auto pr-3 space-y-3">
                    {trafficData?.visitors && trafficData.visitors.length > 0 ? (
                      trafficData.visitors.map((visitor: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow flex-shrink-0">
                          {/* IP and Device */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 flex-1">
                              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                                <Globe className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground break-all">{visitor.ipAddress}</p>
                                <p className="text-xs text-muted-foreground mt-1">{visitor.deviceName}</p>
                              </div>
                            </div>
                            <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold flex-shrink-0">
                              {visitor.visitCount} visits
                            </div>
                          </div>

                          {/* User Agent */}
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground break-words line-clamp-1">{visitor.userAgent}</p>
                          </div>

                          {/* Visit Times */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2 bg-green-50 p-2 rounded">
                              <Clock className="h-3 w-3 text-green-600" />
                              <div>
                                <p className="text-muted-foreground">First Visit</p>
                                <p className="text-green-700 font-medium">
                                  {new Date(visitor.firstVisit).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 p-2 rounded">
                              <Clock className="h-3 w-3 text-blue-600" />
                              <div>
                                <p className="text-muted-foreground">Last Visit</p>
                                <p className="text-blue-700 font-medium">
                                  {new Date(visitor.lastVisit).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Globe className="h-12 w-12 text-muted-foreground/20 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No visitor data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">Loading traffic data...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}