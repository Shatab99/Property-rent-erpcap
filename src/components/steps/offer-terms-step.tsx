"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function OfferTermsStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  const handleContingencyChange = (contingency: string, checked: boolean) => {
    const current = formData.contingencies || []
    let updated = current
    if (checked) {
      updated = [...current, contingency]
    } else {
      updated = current.filter((c: string) => c !== contingency)
    }
    updateFormData({ contingencies: updated })
  }

  const contingencyOptions = ["Inspection", "Financing", "Appraisal"]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="closingDatePreference">Preferred Closing Date *</Label>
        <Input
          id="closingDatePreference"
          type="date"
          required
          value={formData.closingDatePreference || ""}
          onChange={(e) => handleChange("closingDatePreference", e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <Label>Contingencies *</Label>
        <p className="text-sm text-muted-foreground">Select applicable contingencies for this offer</p>
        <div className="space-y-2">
          {contingencyOptions.map((contingency) => (
            <div key={contingency} className="flex items-center space-x-2">
              <Checkbox
                id={`contingency-${contingency}`}
                checked={(formData.contingencies || []).includes(contingency)}
                onCheckedChange={(checked) => handleContingencyChange(contingency, !!checked)}
              />
              <Label htmlFor={`contingency-${contingency}`} className="font-normal cursor-pointer">
                {contingency} Contingency
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Selected Contingencies:</strong> {(formData.contingencies || []).join(", ") || "None selected"}
        </p>
      </div>
    </div>
  )
}
