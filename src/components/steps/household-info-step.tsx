"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useEffect } from "react"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function HouseholdInfoStep({ formData, updateFormData }: StepProps) {

  useEffect(()=>{
    updateFormData({
      pets: formData.pets || false,
    })
  },[])

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
            <Label htmlFor="additionalOccupantName">Full Name</Label>
            <Input
              id="additionalOccupantName"
              placeholder="Sarah Doe"
              value={formData.additionalOccupantName || ""}
              onChange={(e) => handleChange("additionalOccupantName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalOccupantAge">Age</Label>
            <Input
              id="additionalOccupantAge"
              type="number"
              placeholder="28"
              value={formData.additionalOccupantAge || ""}
              onChange={(e) => handleChange("additionalOccupantAge", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationshipWithApplicant">Relationship</Label>
            <Input
              id="relationshipWithApplicant"
              placeholder="Spouse"
              value={formData.relationshipWithApplicant || ""}
              onChange={(e) => handleChange("relationshipWithApplicant", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Do you have any pets? *</Label>
        <RadioGroup value={formData.pets ? "yes" : "no"} onValueChange={(value) => handleChange("pets", value === "yes")}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="yes"
              id="pets-yes"
              className="checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary"
            />
            <Label htmlFor="pets-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="no"
              id="pets-no"
              className="checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary"
            />
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
