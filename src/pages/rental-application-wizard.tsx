"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Check, Download } from "lucide-react"
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

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
  }

  const updateFormData = (data: any) => {
    setFormData({ ...formData, ...data })
  }

   console.log(formData)

  const handleSubmit = async () => {
    setIsGeneratingPDF(true)
    try {
      const { generatePDF } = await import("@/lib/pdf-generator")
      await generatePDF(formData)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("There was an error generating your PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

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
                  disabled={isGeneratingPDF}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isGeneratingPDF ? "Generating PDF..." : "Submit & Download PDF"}
                  {isGeneratingPDF ? (
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}