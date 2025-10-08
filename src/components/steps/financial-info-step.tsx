"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function FinancialInfoStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="creditScore">Credit Score (Optional)</Label>
        <Input
          id="creditScore"
          type="number"
          placeholder="700"
          value={formData.creditScore || ""}
          onChange={(e) => handleChange("creditScore", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">If you know your credit score, you can provide it here</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name *</Label>
          <Input
            id="bankName"
            placeholder="Chase Bank"
            required
            value={formData.bankName || ""}
            onChange={(e) => handleChange("bankName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accountType">Account Type *</Label>
          <Select value={formData.accountType || ""} onValueChange={(value) => handleChange("accountType", value)}>
            <SelectTrigger id="accountType">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">Checking</SelectItem>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
