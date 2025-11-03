"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/lib/baseurl"
import { useEffect, useState } from "react"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function PropertyDetailsStep({ formData, updateFormData }: StepProps) {

  const [propertyData, setPropertyData] = useState<any>(null);

  const fetchPropertyData = async () => {
    try {
      const res = await api.get(`/properties/${formData.listingKey}`);
      setPropertyData(res.data.data);
    }
    catch (error) {
      console.error("Error fetching property data:", error);
    }
  }

  useEffect(() => {
    fetchPropertyData();
  }, [])

  // Auto-fill property details when data is fetched
  useEffect(() => {
    if (propertyData) {
      updateFormData({
        propertyAddress: propertyData.address || "",
        unitNumber: "Admin will decide",
        monthlyRent: propertyData.price || "",
        securityDeposit: propertyData.securityDeposit || "",
      })
    }
  }, [propertyData])

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
          disabled
          className="bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unitNumber">Unit Number</Label>
          <Input
            id="unitNumber"
            placeholder="Admin will decide"
            value={formData.unitNumber || ""}
            disabled
            className="bg-gray-100 cursor-not-allowed"
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
            disabled
            className="bg-gray-100 cursor-not-allowed"
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
          disabled
          className="bg-gray-100 cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground">Auto-filled based on property data</p>
      </div>
    </div>
  )
}
