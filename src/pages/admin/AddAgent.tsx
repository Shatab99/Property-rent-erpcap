"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Upload, UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function AddAgent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate saving to database
    toast({
      title: "Success!",
      description: "Agent has been added successfully.",
    });

    // Navigate back to agent list
    router.push("/admin/agents");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/agents")}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Agent</h1>
          <p className="text-muted-foreground mt-2">
            Create a new agent profile for your property agency
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Photo */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarFallback className="text-2xl">
                    {formData.fullName ? formData.fullName.split(" ").map(n => n[0]).join("").slice(0, 2) : "AG"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="admin-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john.smith@agency.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role/Position</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Sales Agent</SelectItem>
                      <SelectItem value="senior-agent">Senior Agent</SelectItem>
                      <SelectItem value="team-lead">Team Lead</SelectItem>
                      <SelectItem value="broker">Broker</SelectItem>
                      <SelectItem value="manager">Property Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio/Description</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Brief description about the agent's experience, specialties, and background..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Work Settings */}
          <Card className="admin-card lg:col-span-3">
            <CardHeader>
              <CardTitle>Work Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Specializations</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="residential" className="rounded" />
                      <Label htmlFor="residential">Residential Properties</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="commercial" className="rounded" />
                      <Label htmlFor="commercial">Commercial Properties</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="luxury" className="rounded" />
                      <Label htmlFor="luxury">Luxury Properties</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="rentals" className="rounded" />
                      <Label htmlFor="rentals">Rental Properties</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Service Areas</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="downtown" className="rounded" />
                      <Label htmlFor="downtown">Downtown</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="suburbs" className="rounded" />
                      <Label htmlFor="suburbs">Suburbs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="waterfront" className="rounded" />
                      <Label htmlFor="waterfront">Waterfront</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="rural" className="rounded" />
                      <Label htmlFor="rural">Rural Areas</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="commission">Commission Rate (%)</Label>
                    <Input
                      id="commission"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="5.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license">License Number</Label>
                    <Input
                      id="license"
                      placeholder="RE123456789"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                    />
                    <Label htmlFor="isActive">Active Status</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/agents")}
          >
            Cancel
          </Button>
          <Button type="submit" className="admin-button-primary">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Agent
          </Button>
        </div>
      </form>
    </div>
  );
}