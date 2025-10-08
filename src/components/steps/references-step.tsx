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
            <Label htmlFor="ref1Name">Reference Name *</Label>
            <Input
              id="ref1Name"
              placeholder="Robert Johnson"
              required
              value={formData.ref1Name || ""}
              onChange={(e) => handleChange("ref1Name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ref1Relationship">Relationship *</Label>
            <Input
              id="ref1Relationship"
              placeholder="Former Supervisor"
              required
              value={formData.ref1Relationship || ""}
              onChange={(e) => handleChange("ref1Relationship", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ref1Phone">Phone Number *</Label>
              <Input
                id="ref1Phone"
                type="tel"
                placeholder="(555) 444-3333"
                required
                value={formData.ref1Phone || ""}
                onChange={(e) => handleChange("ref1Phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ref1Email">Email Address</Label>
              <Input
                id="ref1Email"
                type="email"
                placeholder="robert.j@example.com"
                value={formData.ref1Email || ""}
                onChange={(e) => handleChange("ref1Email", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Reference 2 (Optional)</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ref2Name">Reference Name</Label>
            <Input
              id="ref2Name"
              placeholder="Emily Davis"
              value={formData.ref2Name || ""}
              onChange={(e) => handleChange("ref2Name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ref2Relationship">Relationship</Label>
            <Input
              id="ref2Relationship"
              placeholder="Personal Friend"
              value={formData.ref2Relationship || ""}
              onChange={(e) => handleChange("ref2Relationship", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ref2Phone">Phone Number</Label>
              <Input
                id="ref2Phone"
                type="tel"
                placeholder="(555) 222-1111"
                value={formData.ref2Phone || ""}
                onChange={(e) => handleChange("ref2Phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ref2Email">Email Address</Label>
              <Input
                id="ref2Email"
                type="email"
                placeholder="emily.d@example.com"
                value={formData.ref2Email || ""}
                onChange={(e) => handleChange("ref2Email", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
