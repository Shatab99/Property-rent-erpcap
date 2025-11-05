"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CheckCircle, Loader } from "lucide-react";
import api from "@/lib/baseurl";
import { toastError } from "@/lib/toast";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  phone: string | null;
  employment: string | null;
  bio: string | null;
  profileImage: string | null;
  address: string | null;
  isVerified: boolean;
  createdAt: string;
  targetedCity: string | null;
  maxBudget: number | null;
  minBudget: number | null;
}

interface UserResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export default function UserDetails({ id }: { id: string }) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null;

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get<UserResponse>(`/admin/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success && response.data.data) {
        setUser(response.data.data);
      } else {
        toastError("Failed to load user details");
        router.push("/admin/users");
      }
    } catch (error) {
      toastError("Error fetching user details");
      console.error("Error:", error);
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">User Not Found</h2>
          <p className="text-muted-foreground mt-2">The requested user could not be found.</p>
          <Button onClick={() => router.push("/admin/users")} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "ACTIVE":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Active</span>;
      case "INACTIVE":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">Inactive</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{upperStatus}</span>;
    }
  };

  const getRoleBadge = (role: string) => {
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">Tenant</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/users")}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Details</h1>
          <p className="text-muted-foreground mt-2">
            Detailed information about {user.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="shadow-sm border lg:col-span-1">
          <CardHeader className="border-b">
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4 bg-primary/10">
                <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                  {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg text-foreground">{user.name}</h3>
              <div className="mt-3 flex items-center gap-2">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
              </div>
              {user.isVerified && (
                <div className="mt-3 flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs font-semibold">Verified</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground break-all">{user.email}</span>
                </div>
              </div>

              {user.phone && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{user.phone}</span>
                  </div>
                </div>
              )}

              {user.address && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Address</p>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{user.address}</span>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Date Joined</p>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">User ID</p>
                <span className="text-xs text-foreground font-mono">{user.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Budget Information */}
          <Card className="shadow-sm border">
            <CardHeader className="border-b">
              <CardTitle>Budget & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Minimum Budget</p>
                  <p className="text-xl font-bold text-foreground">
                    {user.minBudget ? `$${user.minBudget.toLocaleString()}` : 'Not Set'}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Maximum Budget</p>
                  <p className="text-xl font-bold text-foreground">
                    {user.maxBudget ? `$${user.maxBudget.toLocaleString()}` : 'Not Set'}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Targeted City</p>
                  <p className="text-xl font-bold text-foreground">
                    {user.targetedCity || 'Not Set'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card className="shadow-sm border">
            <CardHeader className="border-b">
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Employment</p>
                <p className="text-sm text-foreground">
                  {user.employment || <span className="text-muted-foreground italic">Not provided</span>}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bio</p>
                <p className="text-sm text-foreground">
                  {user.bio ? (
                    <span className="break-words">{user.bio}</span>
                  ) : (
                    <span className="text-muted-foreground italic">No bio provided</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="shadow-sm border">
            <CardHeader className="border-b">
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Account Status</p>
                    <p className="text-xs text-muted-foreground">Current account status</p>
                  </div>
                  {getStatusBadge(user.status)}
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Email Verification</p>
                    <p className="text-xs text-muted-foreground">Email verification status</p>
                  </div>
                  {user.isVerified ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Verified</span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Member Since</p>
                    <p className="text-xs text-muted-foreground">Account creation date</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}