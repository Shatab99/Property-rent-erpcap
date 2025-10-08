"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function ReferencesStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Please provide at least one personal or professional reference.</p>

      <div>
        <h3 className="text-lg font-semibold mb-4">Reference 1 *</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referenceName">Reference Name *</Label>
            <Input
              id="referenceName"
              placeholder="Robert Johnson"
              required
              value={formData.referenceName || ""}
              onChange={(e) => handleChange("referenceName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationshipWithReference">Relationship *</Label>
            <Input
              id="relationshipWithReference"
              placeholder="Former Supervisor"
              required
              value={formData.relationshipWithReference || ""}
              onChange={(e) => handleChange("relationshipWithReference", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referenceContact">Phone Number *</Label>
              <Input
                id="referenceContact"
                type="tel"
                placeholder="(555) 444-3333"
                required
                value={formData.referenceContact || ""}
                onChange={(e) => handleChange("referenceContact", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referenceEmail">Email Address</Label>
              <Input
                id="referenceEmail"
                type="email"
                placeholder="robert.j@example.com"
                value={formData.referenceEmail || ""}
                onChange={(e) => handleChange("referenceEmail", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
