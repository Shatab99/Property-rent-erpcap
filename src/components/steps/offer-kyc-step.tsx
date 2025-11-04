"use client"

import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function OfferKycStep({ formData, updateFormData }: StepProps) {
  const email = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('email='))?.split('=')[1] || null : null;
  const userId = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1] || null : null;

  useEffect(() => {
    if (email && !formData.email) {
      updateFormData({ email, userId })
    }
  }, [email, formData.email, updateFormData])

  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  const handleFileChange = (field: string, file: File | null) => {
    if (file) {
      updateFormData({ [field]: file })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Legal Name *</Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          required
          value={formData.fullName || ""}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="verifiedId">ID Document Upload *</Label>
        <p className="text-sm text-muted-foreground">Upload a clear copy of your government-issued ID (Passport, Driver&apos;s License, etc.)</p>
        <Input
          id="verifiedId"
          type="file"
          accept="image/*,.pdf"
          required
          onChange={(e) => handleFileChange("verifiedId", e.target.files?.[0] || null)}
          className="cursor-pointer"
        />
        {formData.verifiedId && (
          <p className="text-sm text-green-600">File selected: {formData.verifiedId.name || "ID Document"}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>KYC Verification:</strong> Your identity will be verified during the offer review process. Please ensure the ID document is clear and current.
        </p>
      </div>
    </div>
  )
}
