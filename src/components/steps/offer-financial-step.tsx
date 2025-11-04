"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/baseurl"
import { Loader2 } from "lucide-react"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function OfferFinancialStep({ formData, updateFormData }: StepProps) {
  const [propertyData, setPropertyData] = useState(null)
  const [loading, setLoading] = useState(false)
  const hasUpdated = useRef(false)

  const listingKey = formData.listingKey

  useEffect(() => {
    if (!listingKey || hasUpdated.current) return

    const fetchPropertyData = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/properties/${listingKey}`)
        const data = response.data.data || response.data
        setPropertyData(data)

        if (data && !hasUpdated.current) {
          hasUpdated.current = true
          updateFormData({
            propertyAddress: data.address || "",
          })
        }
      } catch (error) {
        console.error("Error fetching property data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPropertyData()
  }, [listingKey])

  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  const handleFileChange = (field: string, file: File | null) => {
    if (file) {
      updateFormData({ [field]: file })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="space-y-2 bg-gray-200 rounded h-12 animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="propertyAddress">Property Address *</Label>
        <Input
          id="propertyAddress"
          placeholder="123 Main Street, City, State, ZIP"
          required
          value={formData.propertyAddress || ""}
          disabled
          className="bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="offerAmount">Offer Amount (USD) *</Label>
          <Input
            id="offerAmount"
            type="number"
            placeholder="500000"
            required
            min="0"
            step="0.01"
            value={formData.offerAmount || ""}
            onChange={(e) => handleChange("offerAmount", parseFloat(e.target.value) || "")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="downPayment">Down Payment (%) *</Label>
          <Input
            id="downPayment"
            type="number"
            placeholder="20"
            required
            min="0"
            max="100"
            step="0.1"
            value={formData.downPayment || ""}
            onChange={(e) => handleChange("downPayment", parseFloat(e.target.value) || "")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="depositAmount">Earnest Money Deposit (USD) *</Label>
        <Input
          id="depositAmount"
          type="number"
          placeholder="25000"
          required
          min="0"
          step="0.01"
          value={formData.depositAmount || ""}
          onChange={(e) => handleChange("depositAmount", parseFloat(e.target.value) || "")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proofOfFunds">Proof of Funds (Document/Image)</Label>
        <p className="text-sm text-muted-foreground">Upload pre-approval letter or proof of funds</p>
        <Input
          id="proofOfFunds"
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => handleFileChange("proofOfFunds", e.target.files?.[0] || null)}
          className="cursor-pointer"
        />
        {formData.proofOfFunds && (
          <p className="text-sm text-green-600">File selected: {formData.proofOfFunds.name || "Proof of Funds"}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bankLetterUrl">Bank Letter (Document/Image)</Label>
        <p className="text-sm text-muted-foreground">Upload a letter from your bank/lender</p>
        <Input
          id="bankLetterUrl"
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => handleFileChange("bankLetterUrl", e.target.files?.[0] || null)}
          className="cursor-pointer"
        />
        {formData.bankLetterUrl && (
          <p className="text-sm text-green-600">File selected: {formData.bankLetterUrl.name || "Bank Letter"}</p>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          <strong>Calculated Down Payment:</strong> ${((formData.offerAmount || 0) * ((formData.downPayment || 0) / 100)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}
