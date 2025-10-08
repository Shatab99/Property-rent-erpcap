"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function PropertyDetailsStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="propertyAddress">Property Address *</Label>
        <Input
          id="propertyAddress"
          placeholder="123 Main Street, Apt 4B"
          required
          value={formData.propertyAddress || ""}
          onChange={(e) => handleChange("propertyAddress", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unitNumber">Unit Number</Label>
          <Input
            id="unitNumber"
            placeholder="4B"
            value={formData.unitNumber || ""}
            onChange={(e) => handleChange("unitNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="moveInDate">Desired Move-in Date *</Label>
          <Input
            id="moveInDate"
            type="date"
            required
            value={formData.moveInDate || ""}
            onChange={(e) => handleChange("moveInDate", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="leaseTerm">Lease Term *</Label>
          <Select value={formData.leaseTerm || ""} onValueChange={(value) => handleChange("leaseTerm", value)}>
            <SelectTrigger id="leaseTerm">
              <SelectValue placeholder="Select lease term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
              <SelectItem value="18">18 months</SelectItem>
              <SelectItem value="24">24 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthlyRent">Monthly Rent *</Label>
          <Input
            id="monthlyRent"
            type="number"
            placeholder="$1,500"
            required
            value={formData.monthlyRent || ""}
            onChange={(e) => handleChange("monthlyRent", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="securityDeposit">Security Deposit Amount</Label>
        <Input
          id="securityDeposit"
          type="number"
          placeholder="$1,500"
          value={formData.securityDeposit || ""}
          onChange={(e) => handleChange("securityDeposit", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Auto-filled based on property data</p>
      </div>
    </div>
  )
}
