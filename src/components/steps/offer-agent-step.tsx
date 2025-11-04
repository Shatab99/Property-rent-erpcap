"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function OfferAgentStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="buyersAgentName">Buyer&apos;s Agent Name</Label>
        <Input
          id="buyersAgentName"
          placeholder="John Smith"
          value={formData.buyersAgentName || ""}
          onChange={(e) => handleChange("buyersAgentName", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="buyersAgentEmail">Buyer&apos;s Agent Email</Label>
          <Input
            id="buyersAgentEmail"
            type="email"
            placeholder="agent@example.com"
            value={formData.buyersAgentEmail || ""}
            onChange={(e) => handleChange("buyersAgentEmail", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buyersAgentPhone">Buyer&apos;s Agent Phone</Label>
          <Input
            id="buyersAgentPhone"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData.buyersAgentPhone || ""}
            onChange={(e) => handleChange("buyersAgentPhone", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agentComments">Special Requests or Comments</Label>
        <Textarea
          id="agentComments"
          placeholder="Any special requests, contingencies, or additional information for the seller..."
          value={formData.agentComments || ""}
          onChange={(e) => handleChange("agentComments", e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Personal Message to Seller (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Share why you love this property or other relevant information..."
          value={formData.message || ""}
          onChange={(e) => handleChange("message", e.target.value)}
          rows={4}
        />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Optional Information:</strong> All fields on this step are optional. However, providing agent details can help facilitate communication with the seller.
        </p>
      </div>
    </div>
  )
}
