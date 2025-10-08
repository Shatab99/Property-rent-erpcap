"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void,
  setIsNext?: (value: boolean) => void,
}

export default function AuthorizationStep({ formData, updateFormData,  setIsNext }: StepProps) {
  useEffect(() => {
    setIsNext && setIsNext(false)
  }, [])
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-muted rounded-lg space-y-4">
        <h3 className="text-lg font-semibold">Application Authorization</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          By submitting this application, you certify that all information provided is true and correct to the best of
          your knowledge. You understand that any false information may result in the rejection of your application or
          termination of your lease agreement.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="certifyTrue"
            required
            checked={formData.certifyTrue || false}
            onCheckedChange={(checked) => handleChange("certifyTrue", checked)}
            onClick={() => setIsNext && setIsNext(true)}
          />
          <div className="space-y-1">
            <Label htmlFor="certifyTrue" className="text-sm font-medium leading-none">
              I certify that all information provided is true and correct *
            </Label>
            <p className="text-sm text-muted-foreground">
              You acknowledge that providing false information may result in application denial.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="space-y-2">
          <Label htmlFor="digitalSignature">Digital Signature *</Label>
          <Input
            id="digitalSignature"
            placeholder="Type your full name"
            required
            value={formData.digitalSignature || ""}
            onChange={(e) => handleChange("digitalSignature", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            By typing your name, you are providing a legal electronic signature
          </p>
        </div>
      </div>
    </div>
  )
}
