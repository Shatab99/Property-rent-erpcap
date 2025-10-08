"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function ResidentialHistoryStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Current Residence</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentAddress">Current Address *</Label>
            <Input
              id="currentAddress"
              placeholder="456 Oak Avenue, Unit 2"
              required
              value={formData.currentAddress || ""}
              onChange={(e) => handleChange("currentAddress", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lengthOfStay">Length of Stay *</Label>
              <Input
                id="lengthOfStay"
                placeholder="2 years 3 months"
                required
                value={formData.lengthOfStay || ""}
                onChange={(e) => handleChange("lengthOfStay", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentRent">Monthly Rent Paid *</Label>
              <Input
                id="currentRent"
                type="number"
                placeholder="$1,200"
                required
                value={formData.currentRent || ""}
                onChange={(e) => handleChange("currentRent", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reasonLeaving">Reason for Leaving *</Label>
            <Textarea
              id="reasonLeaving"
              placeholder="Relocating for work"
              required
              value={formData.reasonLeaving || ""}
              onChange={(e) => handleChange("reasonLeaving", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landlordName">Landlord/Property Manager Name *</Label>
              <Input
                id="landlordName"
                placeholder="Jane Smith"
                required
                value={formData.landlordName || ""}
                onChange={(e) => handleChange("landlordName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landlordContact">Landlord Contact *</Label>
              <Input
                id="landlordContact"
                placeholder="(555) 987-6543"
                required
                value={formData.landlordContact || ""}
                onChange={(e) => handleChange("landlordContact", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Previous Residence (Optional)</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="previousAddress">Previous Address</Label>
            <Input
              id="previousAddress"
              placeholder="789 Elm Street"
              value={formData.previousAddress || ""}
              onChange={(e) => handleChange("previousAddress", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="previousStay">Length of Stay</Label>
              <Input
                id="previousStay"
                placeholder="1 year 6 months"
                value={formData.previousStay || ""}
                onChange={(e) => handleChange("previousStay", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousRent">Monthly Rent Paid</Label>
              <Input
                id="previousRent"
                type="number"
                placeholder="$1,000"
                value={formData.previousRent || ""}
                onChange={(e) => handleChange("previousRent", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
