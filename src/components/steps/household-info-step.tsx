"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function HouseholdInfoStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="numOccupants">Number of Occupants *</Label>
        <Input
          id="numOccupants"
          type="number"
          placeholder="2"
          required
          value={formData.numOccupants || ""}
          onChange={(e) => handleChange("numOccupants", e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <Label>Additional Occupant 1</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="occupant1Name">Full Name</Label>
            <Input
              id="occupant1Name"
              placeholder="Sarah Doe"
              value={formData.occupant1Name || ""}
              onChange={(e) => handleChange("occupant1Name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occupant1Age">Age</Label>
            <Input
              id="occupant1Age"
              type="number"
              placeholder="28"
              value={formData.occupant1Age || ""}
              onChange={(e) => handleChange("occupant1Age", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occupant1Relation">Relationship</Label>
            <Input
              id="occupant1Relation"
              placeholder="Spouse"
              value={formData.occupant1Relation || ""}
              onChange={(e) => handleChange("occupant1Relation", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Do you have any pets? *</Label>
        <RadioGroup value={formData.hasPets || "no"} onValueChange={(value) => handleChange("hasPets", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="pets-yes" />
            <Label htmlFor="pets-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="pets-no" />
            <Label htmlFor="pets-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4 p-4 bg-muted rounded-lg">
        <Label className="text-base font-semibold">Pet Information</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="petType">Type / Breed</Label>
            <Input
              id="petType"
              placeholder="Golden Retriever"
              value={formData.petType || ""}
              onChange={(e) => handleChange("petType", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="petWeight">Weight (lbs)</Label>
            <Input
              id="petWeight"
              type="number"
              placeholder="65"
              value={formData.petWeight || ""}
              onChange={(e) => handleChange("petWeight", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="petDeposit">Pet Deposit</Label>
          <Input
            id="petDeposit"
            type="number"
            placeholder="$300"
            value={formData.petDeposit || ""}
            onChange={(e) => handleChange("petDeposit", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
