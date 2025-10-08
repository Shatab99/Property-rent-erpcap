"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, FileText } from "lucide-react"

interface StepProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function UploadsStep({ formData, updateFormData }: StepProps) {
  const handleChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Upload any additional documents to support your application. All files should be in PDF, JPG, or PNG format.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="govId" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Government ID *
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="govId"
              type="file"
              accept=".pdf,.jpg,.png"
              className="flex-1"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleChange("govId", file.name)
              }}
            />
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payStubs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Pay Stubs / Income Proof *
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="payStubs"
              type="file"
              accept=".pdf,.jpg,.png"
              multiple
              className="flex-1"
              onChange={(e) => {
                const files = e.target.files
                if (files) {
                  const fileNames = Array.from(files)
                    .map((f) => f.name)
                    .join(", ")
                  handleChange("payStubs", fileNames)
                }
              }}
            />
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Upload your most recent 2-3 pay stubs</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rentalHistory" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Rental History Proof or Reference Letter
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="rentalHistory"
              type="file"
              accept=".pdf,.jpg,.png"
              className="flex-1"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleChange("rentalHistory", file.name)
              }}
            />
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="petRecords" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Pet Records (if applicable)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="petRecords"
              type="file"
              accept=".pdf,.jpg,.png"
              multiple
              className="flex-1"
              onChange={(e) => {
                const files = e.target.files
                if (files) {
                  const fileNames = Array.from(files)
                    .map((f) => f.name)
                    .join(", ")
                  handleChange("petRecords", fileNames)
                }
              }}
            />
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Vaccination records, pet registration, etc.</p>
        </div>
      </div>

      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="text-sm text-foreground">
          <strong>Note:</strong> Maximum file size is 10MB per file. Accepted formats: PDF, JPG, PNG.
        </p>
      </div>
    </div>
  )
}
