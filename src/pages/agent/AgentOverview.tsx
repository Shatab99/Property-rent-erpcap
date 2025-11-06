"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Building2, Eye, MessageSquare, TrendingUp, Calendar, Users, DollarSign } from "lucide-react";

export default function AgentOverview() {
  const [stats, setStats] = useState({
    activeListings: 12,
    totalViews: 3420,
    inquiries: 28,
    monthlyLeads: 156,
    totalSales: 45,
    averagePrice: 425000,
    successRate: 92,
    thisMonthSales: 6,
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "inquiry", title: "New inquiry on Park Avenue Apartment", time: "2 hours ago", icon: MessageSquare },
    { id: 2, type: "view", title: "Property listing viewed 25 times", time: "4 hours ago", icon: Eye },
    { id: 3, type: "sale", title: "Property sold: Downtown Luxury Condo", time: "1 day ago", icon: Building2 },
    { id: 4, type: "listing", title: "New property listing posted", time: "2 days ago", icon: Building2 },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome Back!</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Here&apos;s your real estate performance at a glance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Listings */}
          <Card className="shadow-md border hover:shadow-lg transition-shadow duration-300 animate-slideUp">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Active Listings</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stats.activeListings}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 font-semibold">↑ 2 new this week</p>
            </CardContent>
          </Card>

          {/* Total Views */}
          <Card className="shadow-md border hover:shadow-lg transition-shadow duration-300 animate-slideUp" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Views</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 font-semibold">↑ 12% from last month</p>
            </CardContent>
          </Card>

          {/* Inquiries */}
          <Card className="shadow-md border hover:shadow-lg transition-shadow duration-300 animate-slideUp" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Inquiries</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stats.inquiries}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 font-semibold">↑ 5 pending responses</p>
            </CardContent>
          </Card>

          {/* Success Rate */}
          <Card className="shadow-md border hover:shadow-lg transition-shadow duration-300 animate-slideUp" style={{ animationDelay: "0.3s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Success Rate</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stats.successRate}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 font-semibold">↑ Industry leading</p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Performance Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-sm border animate-slideUp" style={{ animationDelay: "0.4s" }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <p className="text-xs text-muted-foreground">Avg. Price</p>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  ${(stats.averagePrice / 1000).toFixed(0)}K
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border animate-slideUp" style={{ animationDelay: "0.5s" }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <p className="text-xs text-muted-foreground">Total Sales</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.totalSales}</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border animate-slideUp" style={{ animationDelay: "0.6s" }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-pink-600" />
                  <p className="text-xs text-muted-foreground">Monthly Leads</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.monthlyLeads}</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border animate-slideUp" style={{ animationDelay: "0.7s" }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.thisMonthSales} sales</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-md border animate-slideUp" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-3 h-10 bg-blue-600 hover:bg-blue-700 text-white">
                <Building2 className="h-4 w-4" />
                Add New Listing
              </Button>
              <Button className="w-full justify-start gap-3 h-10 bg-purple-600 hover:bg-purple-700 text-white">
                <MessageSquare className="h-4 w-4" />
                Respond to Inquiries
              </Button>
              <Button className="w-full justify-start gap-3 h-10 bg-emerald-600 hover:bg-emerald-700 text-white">
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-10">
                <TrendingUp className="h-4 w-4" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-md border animate-slideUp" style={{ animationDelay: "0.8s" }}>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white animate-slideUp" style={{ animationDelay: "1s" }}>
          <h2 className="text-2xl font-bold mb-2">Upgrade Your Subscription</h2>
          <p className="text-blue-100 mb-4">Get access to advanced analytics, unlimited listings, and priority support.</p>
          <Button className="bg-white text-blue-600 hover:bg-slate-100 font-semibold">
            View Plans
          </Button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
