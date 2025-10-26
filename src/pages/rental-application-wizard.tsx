"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Check, Download, Loader } from "lucide-react"
import ApplicantInfoStep from "@/components/steps/applicant-info-step"
import PropertyDetailsStep from "@/components/steps/property-details-step"
import ResidentialHistoryStep from "@/components/steps/residential-history-step"
import EmploymentInfoStep from "@/components/steps/employment-info-step"
import FinancialInfoStep from "@/components/steps/financial-info-step"
import HouseholdInfoStep from "@/components/steps/household-info-step"
import VehicleInfoStep from "@/components/steps/vehicle-info-step"
import BackgroundCheckStep from "@/components/steps/background-check-step"
import ReferencesStep from "@/components/steps/references-step"
import AuthorizationStep from "@/components/steps/authorization-step"
import UploadsStep from "@/components/steps/uploads-step"
import api from "@/lib/baseurl"
import { toastError, toastSuccess } from "@/lib/toast"
import { useRouter } from "next/navigation"


const steps = [
  { id: 1, title: "Applicant Info", icon: "👤", component: ApplicantInfoStep },
  { id: 2, title: "Property Details", icon: "🏠", component: PropertyDetailsStep },
  { id: 3, title: "Residential History", icon: "🏡", component: ResidentialHistoryStep },
  { id: 4, title: "Employment & Income", icon: "💼", component: EmploymentInfoStep },
  { id: 5, title: "Financial Info", icon: "💳", component: FinancialInfoStep },
  { id: 6, title: "Household Info", icon: "👨‍👩‍👧‍👦", component: HouseholdInfoStep },
  { id: 7, title: "Vehicle Info", icon: "🚗", component: VehicleInfoStep },
  { id: 8, title: "Background Check", icon: "⚖️", component: BackgroundCheckStep },
  { id: 9, title: "References", icon: "📄", component: ReferencesStep },
  { id: 10, title: "Authorization", icon: "🖋️", component: AuthorizationStep },
  { id: 11, title: "Uploads", icon: "📎", component: UploadsStep },
]

export default function RentalApplicationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isNext, setIsNext] = useState(true);
  const router = useRouter()


  const progress = (currentStep / steps.length) * 100
  const CurrentStepComponent = steps[currentStep - 1].component

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
    setIsNext(true);
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
      const bodyData: Record<string, any> = {}; // ✅ define this

      // List of file fields
      const fileFields = [
        "proofEmploymentImageUrl",
        "govtIdImageUrl",
        "payStubImageUrl",
        "rentalImageUrl",
        "petRecordImageUrl",
      ];

      // Separate JSON and file fields
      Object.entries(formData).forEach(([key, value]) => {
        if (fileFields.includes(key)) {
          if (value instanceof File) {
            form.append(key, value, value.name);
          } else {
            console.warn(`Skipping ${key}: not a File instance`, value);
          }
        } else {
          bodyData[key] = value;
        }
      });

      // ✅ Append JSON string for non-file data
      form.append("bodyData", JSON.stringify(bodyData));

      // ✅ Submit via axios
      const response = await api.put("/booking/apply-for-rent", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Application submitted successfully!");
      console.log("✅ Server Response:", response.data);
      toastSuccess("✅ Your application has been submitted successfully!");
      router.push("/")
    } catch (err: any) {
      toastError("❌ Error submitting, please fullly fill the form and try again.");
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
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Rental Application</h1>
          <p className="text-muted-foreground text-lg">Complete all steps to submit your application</p>
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
            <CurrentStepComponent formData={formData} updateFormData={updateFormData} setIsNext={setIsNext} />

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
                  disabled={loading}
                >
                  {loading ?
                    <Loader className="animate-spin" />
                    :
                    "Submit Application"
                  }
                </Button>
              ) : (
                <Button disabled={!isNext} onClick={handleNext} className="gap-2">
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