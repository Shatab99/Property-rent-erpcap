import jsPDF from "jspdf"

export async function generatePDF(formData: any) {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const lineHeight = 7
  let yPosition = margin

  // Helper function to add text with automatic page breaks
  const addText = (text: string, fontSize = 10, isBold = false) => {
    if (yPosition > pageHeight - margin) {
      pdf.addPage()
      yPosition = margin
    }
    pdf.setFontSize(fontSize)
    pdf.setFont("helvetica", isBold ? "bold" : "normal")
    pdf.text(text, margin, yPosition)
    yPosition += lineHeight
  }

  // Helper function to add section header
  const addSection = (title: string) => {
    yPosition += 5
    if (yPosition > pageHeight - margin - 20) {
      pdf.addPage()
      yPosition = margin
    }
    pdf.setFillColor(59, 130, 246)
    pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 10, "F")
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text(title, margin + 2, yPosition)
    pdf.setTextColor(0, 0, 0)
    yPosition += 10
  }

  // Add image 
  

  // Title
  pdf.setFontSize(20)
  pdf.setFont("helvetica", "bold")
  pdf.text("Rental Application", pageWidth / 2, yPosition, { align: "center" })
  yPosition += 15

  // 1. Applicant Information
  addSection("1. APPLICANT INFORMATION")
  addText(`Full Name: ${formData.fullName || "N/A"}`)
  addText(`Date of Birth: ${formData.dateOfBirth || "N/A"}`)
  addText(`Social Security Number: ${formData.ssn || "N/A"}`)
  addText(`Driver's License: ${formData.driversLicense || "N/A"}`)
  addText(`Email: ${formData.email || "N/A"}`)
  addText(`Phone: ${formData.phone || "N/A"}`)
  addText(`Emergency Contact: ${formData.emergencyContact || "N/A"}`)
  addText(`Emergency Phone: ${formData.emergencyPhone || "N/A"}`)

  // 2. Property Details
  addSection("2. PROPERTY DETAILS")
  addText(`Property Address: ${formData.propertyAddress || "N/A"}`)
  addText(`Desired Move-in Date: ${formData.moveInDate || "N/A"}`)
  addText(`Lease Term: ${formData.leaseTerm || "N/A"}`)
  addText(`Monthly Rent: ${formData.monthlyRent || "N/A"}`)
  addText(`Number of Occupants: ${formData.numberOfOccupants || "N/A"}`)
  addText(`Pets: ${formData.pets || "N/A"}`)
  if (formData.petDetails) {
    addText(`Pet Details: ${formData.petDetails}`)
  }

  // 3. Residential History
  addSection("3. RESIDENTIAL HISTORY")
  addText(`Current Address: ${formData.currentAddress || "N/A"}`)
  addText(`Move-in Date: ${formData.currentMoveInDate || "N/A"}`)
  addText(`Monthly Rent/Mortgage: ${formData.currentRent || "N/A"}`)
  addText(`Landlord Name: ${formData.landlordName || "N/A"}`)
  addText(`Landlord Phone: ${formData.landlordPhone || "N/A"}`)
  addText(`Reason for Leaving: ${formData.reasonForLeaving || "N/A"}`)

  if (formData.previousAddress) {
    yPosition += 3
    addText("Previous Address:", 10, true)
    addText(`Address: ${formData.previousAddress}`)
    addText(`Duration: ${formData.previousDuration || "N/A"}`)
  }

  // 4. Employment & Income
  addSection("4. EMPLOYMENT & INCOME")
  addText(`Employment Status: ${formData.employmentStatus || "N/A"}`)
  addText(`Employer Name: ${formData.employerName || "N/A"}`)
  addText(`Job Title: ${formData.jobTitle || "N/A"}`)
  addText(`Employment Duration: ${formData.employmentDuration || "N/A"}`)
  addText(`Employer Phone: ${formData.employerPhone || "N/A"}`)
  addText(`Monthly Income: ${formData.monthlyIncome || "N/A"}`)
  addText(`Additional Income: ${formData.additionalIncome || "N/A"}`)
  if (formData.additionalIncomeSource) {
    addText(`Additional Income Source: ${formData.additionalIncomeSource}`)
  }

  // 5. Financial Information
  addSection("5. FINANCIAL INFORMATION")
  addText(`Bank Name: ${formData.bankName || "N/A"}`)
  addText(`Account Type: ${formData.accountType || "N/A"}`)
  addText(`Credit Score Range: ${formData.creditScore || "N/A"}`)
  addText(`Bankruptcy History: ${formData.bankruptcy || "N/A"}`)
  addText(`Eviction History: ${formData.eviction || "N/A"}`)
  addText(`Outstanding Debts: ${formData.outstandingDebts || "N/A"}`)

  // 6. Household Information
  addSection("6. HOUSEHOLD INFORMATION")
  addText(`Number of Adults: ${formData.numberOfAdults || "N/A"}`)
  addText(`Number of Children: ${formData.numberOfChildren || "N/A"}`)
  if (formData.childrenAges) {
    addText(`Children Ages: ${formData.childrenAges}`)
  }
  addText(`Additional Occupants: ${formData.additionalOccupants || "N/A"}`)

  // 7. Vehicle Information
  addSection("7. VEHICLE INFORMATION")
  addText(`Number of Vehicles: ${formData.numberOfVehicles || "N/A"}`)
  if (formData.vehicle1Make) {
    addText(`Vehicle 1: ${formData.vehicle1Make} ${formData.vehicle1Model || ""} (${formData.vehicle1Year || ""})`)
    addText(`License Plate: ${formData.vehicle1License || "N/A"}`)
  }
  if (formData.vehicle2Make) {
    addText(`Vehicle 2: ${formData.vehicle2Make} ${formData.vehicle2Model || ""} (${formData.vehicle2Year || ""})`)
    addText(`License Plate: ${formData.vehicle2License || "N/A"}`)
  }

  // 8. Background Check Consent
  addSection("8. BACKGROUND CHECK CONSENT")
  addText(`Criminal Background Check: ${formData.criminalBackgroundConsent ? "Authorized" : "Not Authorized"}`)
  addText(`Credit Check: ${formData.creditCheckConsent ? "Authorized" : "Not Authorized"}`)
  addText(`Eviction History Check: ${formData.evictionCheckConsent ? "Authorized" : "Not Authorized"}`)

  // 9. References
  addSection("9. REFERENCES")
  if (formData.reference1Name) {
    addText("Reference 1:", 10, true)
    addText(`Name: ${formData.reference1Name}`)
    addText(`Relationship: ${formData.reference1Relationship || "N/A"}`)
    addText(`Phone: ${formData.reference1Phone || "N/A"}`)
    addText(`Email: ${formData.reference1Email || "N/A"}`)
    yPosition += 2
  }
  if (formData.reference2Name) {
    addText("Reference 2:", 10, true)
    addText(`Name: ${formData.reference2Name}`)
    addText(`Relationship: ${formData.reference2Relationship || "N/A"}`)
    addText(`Phone: ${formData.reference2Phone || "N/A"}`)
    addText(`Email: ${formData.reference2Email || "N/A"}`)
  }

  // 10. Authorization
  addSection("10. AUTHORIZATION & DECLARATIONS")
  addText(`Information Accuracy: ${formData.informationAccuracy ? "Confirmed" : "Not Confirmed"}`)
  addText(`Background Check Authorization: ${formData.backgroundCheckAuth ? "Authorized" : "Not Authorized"}`)
  addText(`Terms & Conditions: ${formData.termsAccepted ? "Accepted" : "Not Accepted"}`)
  if (formData.signature) {
    addText(`Signature: ${formData.signature}`)
  }
  if (formData.signatureDate) {
    addText(`Date: ${formData.signatureDate}`)
  }

  // 11. Document Uploads
  addSection("11. DOCUMENT UPLOADS")
  addText("The following documents were uploaded with this application:")
  if (formData.uploadedDocuments && formData.uploadedDocuments.length > 0) {
    formData.uploadedDocuments.forEach((doc: string, index: number) => {
      addText(`${index + 1}. ${doc}`)
    })
  } else {
    addText("No documents uploaded")
  }

  // Footer
  yPosition = pageHeight - 15
  pdf.setFontSize(8)
  pdf.setTextColor(128, 128, 128)
  pdf.text(
    `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
    pageWidth / 2,
    yPosition,
    { align: "center" },
  )

  // Save the PDF
  pdf.save(`rental-application-${formData.fullName || "applicant"}-${Date.now()}.pdf`)
}
