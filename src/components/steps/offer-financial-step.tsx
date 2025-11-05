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
  const [propertyData, setPropertyData] = useState<any>(null)
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

          // Calculate down payment percentage
          const propertyPrice = data.price || data.originalPrice
          const offerAmount = formData.offerAmount || 0
          const downPaymentPercentage = propertyPrice ? ((propertyPrice - offerAmount) / propertyPrice) * 100 : 0

          updateFormData({
            propertyAddress: data.address || "",
            downPayment: Math.max(0, Math.round(downPaymentPercentage * 100) / 100), // Round to 2 decimal places
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

  // Recalculate down payment when offer amount changes
  useEffect(() => {
    if (propertyData && formData.offerAmount) {
      const propertyPrice = propertyData.price || propertyData.originalPrice
      if (propertyPrice) {
        const downPaymentPercentage = ((propertyPrice - formData.offerAmount) / propertyPrice) * 100
        const calculatedDownPayment = Math.max(0, Math.round(downPaymentPercentage * 100) / 100)
        updateFormData({ downPayment: calculatedDownPayment })
      }
    }
  }, [formData.offerAmount, propertyData])

  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  const handleFileChange = (field: string, file: File | null) => {
    if (file) {
      updateFormData({ [field]: file })
    }
  }

  const getDownPaymentColor = (downPayment: number) => {
    if (downPayment <= 20) return 'text-green-600'
    if (downPayment <= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getDownPaymentBgColor = (downPayment: number) => {
    if (downPayment <= 20) return 'bg-green-50 border-green-200'
    if (downPayment <= 40) return 'bg-orange-50 border-orange-200'
    return 'bg-red-50 border-red-200'
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
      {/* Property Price and Down Payment Display */}
      {propertyData && (
        <div className="flex justify-end gap-4 mb-4">
          {/* Property Price */}
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <p className="text-xs text-green-600 font-medium mb-1">Property Price</p>
            <p className="text-lg font-bold text-green-600 font-mono">
              ${((propertyData.price || propertyData.originalPrice) || 0).toLocaleString('en-US')}
            </p>
          </div>

          {/* Down Payment */}
          <div className={`border rounded-lg px-4 py-3 ${getDownPaymentBgColor(formData.downPayment || 0)}`}>
            <p className="text-xs font-medium mb-1" style={{
              color: getDownPaymentColor(formData.downPayment || 0).includes('green') ? '#059669' :
                getDownPaymentColor(formData.downPayment || 0).includes('orange') ? '#d97706' : '#dc2626'
            }}>
              Down Payment
            </p>
            <p className={`text-lg font-bold font-mono ${getDownPaymentColor(formData.downPayment || 0)}`}>
              {(formData.downPayment || 0).toFixed(2)}%
            </p>
          </div>
        </div>
      )}

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
        <div className="space-y-2 hidden">
          <Label htmlFor="downPayment">Down Payment (%) *</Label>
          <Input
            id="downPayment"
            type="number"
            placeholder="20"
            required
            disabled
            min="0"
            max="100"
            step="0.1"
            value={formData.downPayment || ""}
            className="bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">Auto-calculated based on offer amount and property price</p>
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
          <strong>Calculated Down Payment:</strong> ${(((propertyData?.price || propertyData?.originalPrice) || 0) - (formData.offerAmount || 0)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}
