"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function BackgroundCheckStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Have you ever been evicted? *</Label>
        <RadioGroup value={formData.evicted || "no"} onValueChange={(value) => handleChange("evicted", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="evicted-yes" />
            <Label htmlFor="evicted-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="evicted-no" />
            <Label htmlFor="evicted-no">No</Label>
          </div>
        </RadioGroup>
        <div className="space-y-2">
          <Label htmlFor="evictionExplain">If yes, please explain</Label>
          <Textarea
            id="evictionExplain"
            placeholder="Provide details..."
            value={formData.evictionExplain || ""}
            onChange={(e) => handleChange("evictionExplain", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Have you ever broken a lease? *</Label>
        <RadioGroup value={formData.brokenLease || "no"} onValueChange={(value) => handleChange("brokenLease", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="lease-yes" />
            <Label htmlFor="lease-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="lease-no" />
            <Label htmlFor="lease-no">No</Label>
          </div>
        </RadioGroup>
        <div className="space-y-2">
          <Label htmlFor="leaseExplain">If yes, please explain</Label>
          <Textarea
            id="leaseExplain"
            placeholder="Provide details..."
            value={formData.leaseExplain || ""}
            onChange={(e) => handleChange("leaseExplain", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Have you been convicted of a felony or misdemeanor? *</Label>
        <RadioGroup value={formData.conviction || "no"} onValueChange={(value) => handleChange("conviction", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="conviction-yes" />
            <Label htmlFor="conviction-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="conviction-no" />
            <Label htmlFor="conviction-no">No</Label>
          </div>
        </RadioGroup>
        <div className="space-y-2">
          <Label htmlFor="convictionExplain">If yes, please explain</Label>
          <Textarea
            id="convictionExplain"
            placeholder="Provide details..."
            value={formData.convictionExplain || ""}
            onChange={(e) => handleChange("convictionExplain", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
        <Checkbox
          id="backgroundConsent"
          checked={formData.backgroundConsent || false}
          onCheckedChange={(checked) => handleChange("backgroundConsent", checked)}
        />
        <div className="space-y-1">
          <Label htmlFor="backgroundConsent" className="text-sm font-medium leading-none">
            I consent to a background check *
          </Label>
          <p className="text-sm text-muted-foreground">
            By checking this box, you authorize us to conduct a background check as part of the rental application
            process.
          </p>
        </div>
      </div>
    </div>
  )
}
