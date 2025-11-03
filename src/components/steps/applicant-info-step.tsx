"use client"

import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function ApplicantInfoStep({ formData, updateFormData }: StepProps) {

  const email = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('email='))?.split('=')[1] || null : null;

  // Set email in form data when component mounts
  useEffect(() => {
    if (email && !formData.email) {
      updateFormData({ email })
    }
  }, [email, formData.email, updateFormData])

  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 md:col-span-2 lg:col-span-3">
          <Label htmlFor="fullName">Full Legal Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            required
            value={formData.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
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
            placeholder="your-email@example.com"
            required
            value={formData.email || ""}
            disabled
            className="bg-gray-100 cursor-not-allowed"
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
    </div>
  )
}
