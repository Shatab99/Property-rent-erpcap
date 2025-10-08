"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function VehicleInfoStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Please provide information about vehicles that will be parked at the property.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleMake">Vehicle Make</Label>
          <Input
            id="vehicleMake"
            placeholder="Toyota"
            value={formData.vehicleMake || ""}
            onChange={(e) => handleChange("vehicleMake", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleModel">Vehicle Model</Label>
          <Input
            id="vehicleModel"
            placeholder="Camry"
            value={formData.vehicleModel || ""}
            onChange={(e) => handleChange("vehicleModel", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleYear">Year</Label>
          <Input
            id="vehicleYear"
            type="number"
            placeholder="2022"
            value={formData.vehicleYear || ""}
            onChange={(e) => handleChange("vehicleYear", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleColor">Color</Label>
          <Input
            id="vehicleColor"
            placeholder="Silver"
            value={formData.vehicleColor || ""}
            onChange={(e) => handleChange("vehicleColor", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehiclePlate">License Plate Number</Label>
          <Input
            id="vehiclePlate"
            placeholder="ABC1234"
            value={formData.vehiclePlate || ""}
            onChange={(e) => handleChange("vehiclePlate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleState">State</Label>
          <Input
            id="vehicleState"
            placeholder="CA"
            value={formData.vehicleState || ""}
            onChange={(e) => handleChange("vehicleState", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
