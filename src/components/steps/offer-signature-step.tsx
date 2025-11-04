"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function OfferSignatureStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }


  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          <strong>Review Your Offer:</strong> Please carefully review all information before signing. This is a legally binding document.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="digitalSignature">Digital Signature *</Label>
        <p className="text-sm text-muted-foreground">Type your full name as your digital signature</p>
        <Input
          id="digitalSignature"
          placeholder="Your Full Name"
          required
          value={formData.digitalSignature || ""}
          onChange={(e) => handleChange("digitalSignature", e.target.value)}
          className="font-semibold text-lg"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="consentAcknowledged"
            checked={formData.consentAcknowledged || false}
            onCheckedChange={(checked) => handleChange("consentAcknowledged", checked)}
          />
          <Label htmlFor="consentAcknowledged" className="font-normal cursor-pointer">
            I hereby acknowledge and agree to the terms and conditions of this offer *
          </Label>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="legalConsent"
            checked={formData.legalConsent || false}
            onCheckedChange={(checked) => handleChange("legalConsent", checked)}
          />
          <Label htmlFor="legalConsent" className="font-normal cursor-pointer">
            I certify that all information provided is true and accurate *
          </Label>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-900">
          <strong>Legal Notice:</strong> By signing this offer, you agree that this constitutes a legally binding contract. 
          Submission of a false application may result in legal action. Please ensure all information is accurate and complete.
        </p>
      </div>
    </div>
  )
}
