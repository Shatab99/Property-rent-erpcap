"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CheckCircle, Loader, FileText, Image as ImageIcon } from "lucide-react";
import api from "@/lib/baseurl";
import { toastError } from "@/lib/toast";

interface LandlordData {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  phone: string | null;
  bio: string | null;
  profileImage: string | null;
  address: string | null;
  isVerified: boolean;
  createdAt: string;
  nidCardPhoto: string | null;
}

interface LandlordResponse {
  success: boolean;
  message: string;
  data: LandlordData;
}

export default function LandlordDetails({ id }: { id: string }) {
  const router = useRouter();
  const [landlord, setLandlord] = useState<LandlordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null;

  useEffect(() => {
    fetchLandlordDetails();
  }, [id]);

  const fetchLandlordDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get<LandlordResponse>(`/admin/landlord/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success && response.data.data) {
        setLandlord(response.data.data);
      } else {
        toastError("Failed to load landlord details");
        router.push("/admin/landlords");
      }
    } catch (error) {
      toastError("Error fetching landlord details");
      console.error("Error:", error);
      router.push("/admin/landlords");
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

  if (!landlord) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Landlord Not Found</h2>
          <p className="text-muted-foreground mt-2">The requested landlord could not be found.</p>
          <Button onClick={() => router.push("/admin/landlords")} className="mt-4">
            Back to Landlords
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "APPROVED":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Approved</span>;
      case "ACTIVE":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Active</span>;
      case "PENDING":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending</span>;
      case "INACTIVE":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">Inactive</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{upperStatus}</span>;
    }
  };

  const handleApproveLandlord = async () => {
    setActionLoading(true);
    try {
      const response = await api.put(
        `/admin/approve-reject/${id}`,
        { status: "APPROVED" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toastError("✅ Landlord approved successfully!");
        // Refetch landlord details
        fetchLandlordDetails();
      } else {
        toastError("❌ Failed to approve landlord");
      }
    } catch (error: any) {
      toastError("❌ Error approving landlord");
      console.error("Error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectLandlord = async () => {
    setActionLoading(true);
    try {
      const response = await api.put(
        `/admin/approve-reject/${id}`,
        { status: "REJECTED" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toastError("✅ Landlord rejected successfully!");
        // Refetch landlord details
        fetchLandlordDetails();
      } else {
        toastError("❌ Failed to reject landlord");
      }
    } catch (error: any) {
      toastError("❌ Error rejecting landlord");
      console.error("Error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/landlords")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Landlord Details</h1>
            <p className="text-muted-foreground mt-2">
              Detailed information about {landlord.name}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleApproveLandlord}
            disabled={actionLoading || landlord.status === 'APPROVED'}
          >
            {actionLoading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Approve Landlord'
            )}
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={handleRejectLandlord}
            disabled={actionLoading || landlord.status === 'REJECTED'}
          >
            {actionLoading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Reject Landlord'
            )}
          </Button>
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
              <Avatar className="h-32 w-32 mb-4 rounded-lg">
                <AvatarImage src={landlord.profileImage || undefined} alt={landlord.name} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary rounded-lg">
                  {landlord.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg text-foreground">{landlord.name}</h3>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  Landlord
                </span>
                {getStatusBadge(landlord.status)}
              </div>
              {landlord.isVerified && (
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
                  <span className="text-sm text-foreground break-all">{landlord.email}</span>
                </div>
              </div>

              {landlord.phone && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{landlord.phone}</span>
                  </div>
                </div>
              )}

              {landlord.address && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Address</p>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{landlord.address}</span>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Date Joined</p>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {new Date(landlord.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Landlord ID</p>
                <span className="text-xs text-foreground font-mono">{landlord.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Section */}
          {landlord.bio && (
            <Card className="shadow-sm border">
              <CardHeader className="border-b">
                <CardTitle>Bio</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-foreground leading-relaxed">
                  {landlord.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Documents Section */}
          <Card className="shadow-sm border">
            <CardHeader className="border-b">
              <CardTitle>Verification Documents</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* NID Card Photo */}
                {landlord.nidCardPhoto && (
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">NID Card Photo</p>
                        <p className="text-xs text-muted-foreground">Identity verification document</p>
                      </div>
                    </div>
                    <a
                      href={landlord.nidCardPhoto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      View
                    </a>
                  </div>
                )}

                {/* Profile Image */}
                {landlord.profileImage && (
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Profile Image</p>
                        <p className="text-xs text-muted-foreground">Landlord profile photo</p>
                      </div>
                    </div>
                    <a
                      href={landlord.profileImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      View
                    </a>
                  </div>
                )}

                {!landlord.nidCardPhoto && !landlord.profileImage && (
                  <p className="text-center text-muted-foreground py-6">No documents uploaded</p>
                )}
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
                  {getStatusBadge(landlord.status)}
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Email Verification</p>
                    <p className="text-xs text-muted-foreground">Email verification status</p>
                  </div>
                  {landlord.isVerified ? (
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
                    {new Date(landlord.createdAt).toLocaleDateString('en-US', {
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
