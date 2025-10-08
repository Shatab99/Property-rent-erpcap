"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function ApplicantInfoStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            placeholder="John"
            required
            value={formData.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            placeholder="Michael"
            value={formData.middleName || ""}
            onChange={(e) => handleChange("middleName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            required
            value={formData.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input
            id="dob"
            type="date"
            required
            value={formData.dob || ""}
            onChange={(e) => handleChange("dob", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            required
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            required
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ssn">Social Security Number</Label>
          <Input
            id="ssn"
            type="password"
            placeholder="XXX-XX-XXXX"
            value={formData.ssn || ""}
            onChange={(e) => handleChange("ssn", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="driverLicense">{`Driver's`} License or State ID Number *</Label>
        <Input
          id="driverLicense"
          placeholder="D1234567"
          required
          value={formData.driverLicense || ""}
          onChange={(e) => handleChange("driverLicense", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photoId">Upload Photo ID *</Label>
        <div className="flex items-center gap-2">
          <Input
            id="photoId"
            type="file"
            accept="image/*,.pdf"
            className="flex-1"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleChange("photoId", file.name)
            }}
          />
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
      </div>
    </div>
  )
}
