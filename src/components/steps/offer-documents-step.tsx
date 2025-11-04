"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StepProps {
    formData: any
    updateFormData: (data: any) => void
}

export default function OfferDocumentsStep({ formData, updateFormData }: StepProps) {
    const handleFileChange = (field: string, file: File | null) => {
        if (file) {
            updateFormData({ [field]: file })
        }
    }

    const documentFields = [
        {
            field: "proofOfIncomeUrl",
            label: "Proof of Income",
            description: "Tax returns, W-2s, or income statements"
        },
        {
            field: "additionalDocument",
            label: "Additional Supporting Document (Optional)",
            description: "Upload any other relevant document"
        },
    ]

    return (
        <div className="space-y-6">
            {documentFields.map((doc) => (
                <div key={doc.field} className="space-y-2">
                    <Label htmlFor={doc.field}>{doc.label}</Label>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                    <Input
                        id={doc.field}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(doc.field, e.target.files?.[0] || null)}
                        className="cursor-pointer"
                    />
                    {formData[doc.field] && (
                        <p className="text-sm text-green-600">
                            File selected: {formData[doc.field].name || doc.label}
                        </p>
                    )}
                </div>
            ))}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Document Tips:</strong> Ensure all documents are clear, readable, and in PDF or image format. Maximum file size: 5MB per file.
                </p>
            </div>
        </div>
    )
}
