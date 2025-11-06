"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader, FileText } from "lucide-react";
import api from "@/lib/baseurl";
import { toastError } from "@/lib/toast";

export default function AgentSettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [bio, setBio] = useState("");
  const [bioLoading, setBioLoading] = useState(false);
  const [bioSuccess, setBioSuccess] = useState(false);
  const [bioError, setBioError] = useState("");

  const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) {
      toastError("Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(
        "/auth/change-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toastError("✅ Password changed successfully!");

        // Reset success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        toastError("❌ Failed to change password");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrors({ currentPassword: "Current password is incorrect" });
        toastError("❌ Current password is incorrect");
      } else {
        toastError("❌ Error changing password");
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bio.trim()) {
      setBioError("Bio cannot be empty");
      return;
    }

    if (bio.length > 500) {
      setBioError("Bio must be less than 500 characters");
      return;
    }

    setBioError("");
    setBioLoading(true);

    try {
      const response = await api.put(
        "/agent/update-bio",
        { bio: bio.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBioSuccess(true);
        toastError("✅ Bio updated successfully!");

        // Reset success message after 5 seconds
        setTimeout(() => setBioSuccess(false), 5000);
      } else {
        setBioError("Failed to update bio");
        toastError("❌ Failed to update bio");
      }
    } catch (error: any) {
      setBioError(error.response?.data?.message || "Error updating bio");
      toastError("❌ Error updating bio");
      console.error("Error:", error);
    } finally {
      setBioLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your account and security settings
          </p>
        </div>
        {/* Update Bio Section */}
        <Card className="my-6 shadow-md border hover:shadow-lg transition-shadow duration-300 animate-slideUp" style={{ animationDelay: "0.15s" }}>
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-purple-600" />
              Update Bio
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Share a bit about yourself to help clients get to know you better</p>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Success Message */}
            {bioSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 animate-slideUp">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Bio updated successfully!</span>
              </div>
            )}

            {/* Error Message */}
            {bioError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-slideUp">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-700">{bioError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateBio} className="space-y-4">
              <div className="space-y-2 animate-fadeInUp">
                <Label htmlFor="bio" className="text-sm font-semibold">
                  Your Bio
                </Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    if (bioError) setBioError("");
                  }}
                  placeholder="Tell us about your experience, specialties, and what makes you unique as an agent..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 resize-none"
                  rows={5}
                  maxLength={500}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Max 500 characters</span>
                  <span className={bio.length > 450 ? "text-orange-600 font-semibold" : ""}>
                    {bio.length}/500
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={bioLoading || !bio.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bioLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Update Bio
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setBio("");
                    setBioError("");
                    setBioSuccess(false);
                  }}
                  disabled={bioLoading}
                  className="flex-1"
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="shadow-lg border animate-slideUp">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Change Password</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep your account secure by updating your password regularly
                </p>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-slideDown">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Password Updated</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your password has been changed successfully. Please use your new password for future logins.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
                <Label htmlFor="currentPassword" className="text-sm font-semibold">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your current password"
                    className={`pr-10 ${errors.currentPassword ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.currentPassword}
                  </div>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
                <Label htmlFor="newPassword" className="text-sm font-semibold">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your new password"
                    className={`pr-10 ${errors.newPassword ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.newPassword}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  • At least 8 characters • Mix of letters, numbers, and symbols recommended
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
                <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your new password"
                    className={`pr-10 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2 h-10"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setErrors({});
                    setSuccess(false);
                  }}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>



        {/* Security Tips */}
        <Card className="mt-6 shadow-sm border bg-blue-50 border-blue-200 animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              Security Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Use a password that is at least 8 characters long</li>
              <li>✓ Mix uppercase, lowercase, numbers, and special characters</li>
              <li>✓ Don&apos;t share your password with anyone</li>
              <li>✓ Change your password regularly (every 90 days recommended)</li>
              <li>✓ Never use the same password across multiple accounts</li>
            </ul>
          </CardContent>
        </Card>
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

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
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
          animation: slideUp 0.6s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
