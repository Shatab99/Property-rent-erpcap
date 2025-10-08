"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function EmploymentInfoStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employerName">Employer Name *</Label>
          <Input
            id="employerName"
            placeholder="Acme Corporation"
            required
            value={formData.employerName || ""}
            onChange={(e) => handleChange("employerName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title / Occupation *</Label>
          <Input
            id="jobTitle"
            placeholder="Software Engineer"
            required
            value={formData.jobTitle || ""}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="employerAddress">Employer Address *</Label>
        <Input
          id="employerAddress"
          placeholder="100 Business Park Drive"
          required
          value={formData.employerAddress || ""}
          onChange={(e) => handleChange("employerAddress", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="workPhone">Work Phone / HR Contact *</Label>
          <Input
            id="workPhone"
            type="tel"
            placeholder="(555) 111-2222"
            required
            value={formData.workPhone || ""}
            onChange={(e) => handleChange("workPhone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lengthEmployment">Length of Employment *</Label>
          <Input
            id="lengthEmployment"
            placeholder="3 years 2 months"
            required
            value={formData.lengthEmployment || ""}
            onChange={(e) => handleChange("lengthEmployment", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="monthlyIncome">Monthly Income / Salary *</Label>
        <Input
          id="monthlyIncome"
          type="number"
          placeholder="$5,000"
          required
          value={formData.monthlyIncome || ""}
          onChange={(e) => handleChange("monthlyIncome", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proofEmploymentImageUrl">Upload Pay Stubs / Offer Letter / Bank Statements *</Label>
        <div className="flex items-center gap-2">
          <Input
            id="proofEmploymentImageUrl"
            type="file"
            accept=".pdf,.jpg,.png"
            multiple
            className="flex-1"
            onChange={(e) => {
              const files = e.target.files?.[0]
              if (files) handleChange("proofEmploymentImageUrl", files) // ✅ store File
            }}
          />
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Upload recent pay stubs or employment verification (Max 10MB per file)
        </p>
      </div>
    </div>
  )
}
