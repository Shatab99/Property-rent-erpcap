"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Loader } from "lucide-react"
import OfferKycStep from "@/components/steps/offer-kyc-step"
import OfferFinancialStep from "@/components/steps/offer-financial-step"
import OfferTermsStep from "@/components/steps/offer-terms-step"
import OfferAgentStep from "@/components/steps/offer-agent-step"
import OfferDocumentsStep from "@/components/steps/offer-documents-step"
import OfferSignatureStep from "@/components/steps/offer-signature-step"
import api from "@/lib/baseurl"
import { toastError, toastSuccess } from "@/lib/toast"
import { useParams, useRouter } from "next/navigation"

const steps = [
    { id: 1, title: "KYC Verification", icon: "👤", component: OfferKycStep },
    { id: 2, title: "Financial Details", icon: "💰", component: OfferFinancialStep },
    { id: 3, title: "Offer Terms", icon: "📋", component: OfferTermsStep },
    { id: 4, title: "Buyer's Agent (Optional)", icon: "🤝", component: OfferAgentStep },
    { id: 5, title: "Supporting Docs", icon: "📎", component: OfferDocumentsStep },
    { id: 6, title: "Signature & Consent", icon: "🖋️", component: OfferSignatureStep },
]

// Validation rules for each step
const requiredFieldsByStep: Record<number, string[]> = {
    1: ["fullName", "phone", "verifiedId"], // KYC Verification (email auto-filled and required by API)
    2: ["offerAmount", "downPayment", "depositAmount"], // Financial Details
    3: ["closingDatePreference", "contingencies"], // Offer Terms
    4: [], // Buyer's Agent (all optional)
    5: ["proofOfIncomeUrl"], // Supporting Docs (required)
    6: ["digitalSignature", "consentAcknowledged", "legalConsent"], // Signature & Consent
}

// Function to validate if all required fields for current step are filled
const isStepComplete = (stepId: number, formData: any): boolean => {
    const requiredFields = requiredFieldsByStep[stepId] || []
    return requiredFields.every(field => {
        const value = formData[field]
        // Check if field has a valid value
        if (Array.isArray(value)) {
            return value.length > 0
        }
        if (value instanceof File) {
            return true
        }
        return value && value !== ""
    })
}

export default function OfferFormWizard({ id }: { id: string }) {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isStepValid, setIsStepValid] = useState(false)
    const router = useRouter()
    const params = useParams()
    const listingId = params?.id as string | undefined
    const token = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null

    const progress = (currentStep / steps.length) * 100
    const CurrentStepComponent = steps[currentStep - 1].component


    console.log(formData)

    useEffect(() => {
        if (!token) {
            toastError("Please log in to make an offer.")
            router.push("/login")
        } else if (listingId) {
            // Set listingKey in form data by default
            setFormData(prev => ({ ...prev, listingKey: listingId }))
        }
    }, [token, listingId, router])

    // Validate current step whenever formData changes
    useEffect(() => {
        const isValid = isStepComplete(currentStep, formData)
        setIsStepValid(isValid)
    }, [formData, currentStep])

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const updateFormData = (data: any) => {
        setFormData({ ...formData, ...data })
    }

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const form = new FormData();
            const bodyData: Record<string, any> = {};

            // List of file fields
            const fileFields = [
                "verifiedId",
                "proofOfFunds",
                "bankLetterUrl",
                "proofOfIncomeUrl",
                "additionalDocument",
            ];

            // Separate JSON and file fields directly from formData state
            Object.entries(formData).forEach(([key, value]) => {
                if (fileFields.includes(key)) {
                    // Handle file fields
                    if (value instanceof File) {
                        form.append(key, value, value.name);
                    } else {
                        console.warn(`Skipping ${key}: not a File instance`, value);
                    }
                } else {
                    // Handle regular fields - add to bodyData
                    bodyData[key] = value;
                }
            });

            // Append JSON data as stringified body
            form.append("bodyData", JSON.stringify(bodyData));

            console.log("✅ Form Data:", {
                bodyData,
                files: Array.from(form.keys()),
            });

            // Submit via axios
            const response = await api.post("/booking/make-offer", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });

            setSuccess("Application submitted successfully!");
            console.log("✅ Server Response:", response.data);
            toastSuccess("✅ Your application has been submitted successfully!");
            router.push("/listings")
        } catch (err: any) {
            toastError("❌ Error submitting, please fully fill the form and try again.");
            console.log(err)
            setError(err?.response?.data?.message || err?.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Property Offer Submission</h1>
                    <p className="text-muted-foreground text-lg">Complete all steps to submit your offer</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                            Step {currentStep} of {steps.length}
                        </span>
                        <span className="text-sm font-medium text-foreground">{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                                {steps[currentStep - 1].icon}
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{steps[currentStep - 1].title}</CardTitle>
                                <CardDescription>
                                    Step {currentStep} of {steps.length}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <CurrentStepComponent formData={formData} updateFormData={updateFormData} />

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className="gap-2 bg-transparent"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>

                            {currentStep === steps.length ? (
                                <Button
                                    onClick={handleSubmit}
                                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                    disabled={loading || !isStepValid}
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Offer"
                                    )}
                                </Button>
                            ) : (
                                <Button disabled={!isStepValid} onClick={handleNext} className="gap-2">
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                        {success && <div className="text-green-500 mt-2">{success}</div>}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
