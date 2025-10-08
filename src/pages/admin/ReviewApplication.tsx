"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  Download,
  Edit,
  FileText,
  Home,
  User,
  Briefcase,
  DollarSign,
  Users,
  Car,
  Shield,
  Phone,
  Upload,
} from "lucide-react"
import Link from "next/link"

export default function ReviewApplication() {
  const searchParams = useSearchParams()

  // In a real app, you'd fetch this data from a database or state management
  // For now, we'll use mock data structure
  const applicationData = {
    status: "pending", // pending, approved, rejected
    submittedDate: new Date().toLocaleDateString(),
    applicationId: "APP-2025-001",

    // Applicant Info
    applicantInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      dateOfBirth: "01/15/1990",
      ssn: "***-**-1234",
      driversLicense: "D1234567",
      driversLicenseState: "CA",
    },

    // Property Details
    propertyDetails: {
      propertyAddress: "123 Main Street, Apt 4B",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      desiredMoveInDate: "06/01/2025",
      leaseTerm: "12 months",
      monthlyRent: "$2,500",
    },

    // Residential History
    residentialHistory: [
      {
        address: "456 Oak Avenue, Los Angeles, CA 90001",
        moveInDate: "01/2022",
        moveOutDate: "Present",
        monthlyRent: "$2,200",
        landlordName: "Jane Smith",
        landlordPhone: "(555) 987-6543",
        reasonForLeaving: "Relocating for work",
      },
      {
        address: "789 Pine Street, San Diego, CA 92101",
        moveInDate: "06/2019",
        moveOutDate: "12/2021",
        monthlyRent: "$1,800",
        landlordName: "Bob Johnson",
        landlordPhone: "(555) 456-7890",
        reasonForLeaving: "Job relocation",
      },
    ],

    // Employment Info
    employmentInfo: {
      employmentStatus: "Employed",
      employerName: "Tech Corp Inc.",
      jobTitle: "Software Engineer",
      employmentDuration: "3 years",
      supervisorName: "Sarah Williams",
      supervisorPhone: "(555) 111-2222",
      monthlyIncome: "$8,500",
      additionalIncome: "$1,000",
      additionalIncomeSource: "Freelance consulting",
    },

    // Financial Info
    financialInfo: {
      bankName: "Chase Bank",
      accountType: "Checking",
      accountNumber: "****1234",
      creditScore: "750",
      bankruptcy: "No",
      bankruptcyDetails: "",
      outstandingDebts: "$15,000",
      debtDetails: "Student loans",
    },

    // Household Info
    householdInfo: {
      numberOfOccupants: "2",
      occupants: [{ name: "Jane Doe", relationship: "Spouse", age: "28" }],
      pets: "Yes",
      petDetails: "1 dog (Golden Retriever, 3 years old, 60 lbs)",
      smoking: "No",
    },

    // Vehicle Info
    vehicles: [
      {
        make: "Toyota",
        model: "Camry",
        year: "2020",
        color: "Silver",
        licensePlate: "ABC1234",
        state: "CA",
      },
    ],

    // Background Check
    backgroundCheck: {
      criminalHistory: "No",
      criminalDetails: "",
      evictionHistory: "No",
      evictionDetails: "",
      consentToBackgroundCheck: "Yes",
    },

    // References
    references: [
      {
        name: "Michael Brown",
        relationship: "Former Colleague",
        phone: "(555) 222-3333",
        email: "michael.brown@example.com",
      },
      {
        name: "Emily Davis",
        relationship: "Friend",
        phone: "(555) 444-5555",
        email: "emily.davis@example.com",
      },
    ],

    // Authorization
    authorization: {
      signature: "John Doe",
      date: "10/08/2025",
      consentToCredit: "Yes",
      consentToContact: "Yes",
    },

    // Uploads
    uploads: {
      idDocument: "drivers_license.pdf",
      proofOfIncome: "pay_stubs.pdf",
      bankStatements: "bank_statement.pdf",
      references: "reference_letters.pdf",
    },
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending Review</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Application Review</h1>
              <p className="text-muted-foreground text-lg">
                Application ID: <span className="font-mono text-foreground">{applicationData.applicationId}</span>
              </p>
            </div>
            {getStatusBadge(applicationData.status)}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Submitted: {applicationData.submittedDate}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href="/">
              <Edit className="h-4 w-4" />
              Edit Application
            </Link>
          </Button>

          {/* Admin Actions */}
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 border-green-500/20 text-green-500 hover:bg-green-500/10 bg-transparent"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-red-500/20 text-red-500 hover:bg-red-500/10 bg-transparent"
            >
              Reject
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Applicant Information</CardTitle>
                  <CardDescription>Personal details and contact information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">Full Name</TableCell>
                    <TableCell>
                      {applicationData.applicantInfo.firstName} {applicationData.applicantInfo.lastName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>{applicationData.applicantInfo.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Phone</TableCell>
                    <TableCell>{applicationData.applicantInfo.phone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Date of Birth</TableCell>
                    <TableCell>{applicationData.applicantInfo.dateOfBirth}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SSN</TableCell>
                    <TableCell className="font-mono">{applicationData.applicantInfo.ssn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{`Driver's`} License</TableCell>
                    <TableCell>
                      {applicationData.applicantInfo.driversLicense} (
                      {applicationData.applicantInfo.driversLicenseState})
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Property Details</CardTitle>
                  <CardDescription>Desired property and lease information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">Property Address</TableCell>
                    <TableCell>{applicationData.propertyDetails.propertyAddress}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">City, State, ZIP</TableCell>
                    <TableCell>
                      {applicationData.propertyDetails.city}, {applicationData.propertyDetails.state}{" "}
                      {applicationData.propertyDetails.zipCode}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Desired Move-In Date</TableCell>
                    <TableCell>{applicationData.propertyDetails.desiredMoveInDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Lease Term</TableCell>
                    <TableCell>{applicationData.propertyDetails.leaseTerm}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Monthly Rent</TableCell>
                    <TableCell className="text-lg font-semibold">
                      {applicationData.propertyDetails.monthlyRent}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Residential History */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Residential History</CardTitle>
                  <CardDescription>Previous addresses and landlord information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {applicationData.residentialHistory.map((residence, index) => (
                  <div key={index}>
                    {index > 0 && <Separator className="my-6" />}
                    <div className="mb-3">
                      <h4 className="font-semibold text-foreground mb-1">Residence {index + 1}</h4>
                      <p className="text-sm text-muted-foreground">{residence.address}</p>
                    </div>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium w-1/3">Duration</TableCell>
                          <TableCell>
                            {residence.moveInDate} - {residence.moveOutDate}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Monthly Rent</TableCell>
                          <TableCell>{residence.monthlyRent}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Landlord</TableCell>
                          <TableCell>
                            {residence.landlordName} - {residence.landlordPhone}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Reason for Leaving</TableCell>
                          <TableCell>{residence.reasonForLeaving}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Employment & Income */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Employment & Income</CardTitle>
                  <CardDescription>Current employment and income details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">Employment Status</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        {applicationData.employmentInfo.employmentStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Employer</TableCell>
                    <TableCell>{applicationData.employmentInfo.employerName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Job Title</TableCell>
                    <TableCell>{applicationData.employmentInfo.jobTitle}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Employment Duration</TableCell>
                    <TableCell>{applicationData.employmentInfo.employmentDuration}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Supervisor</TableCell>
                    <TableCell>
                      {applicationData.employmentInfo.supervisorName} - {applicationData.employmentInfo.supervisorPhone}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Monthly Income</TableCell>
                    <TableCell className="text-lg font-semibold text-green-500">
                      {applicationData.employmentInfo.monthlyIncome}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Additional Income</TableCell>
                    <TableCell>
                      {applicationData.employmentInfo.additionalIncome} (
                      {applicationData.employmentInfo.additionalIncomeSource})
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Financial Information</CardTitle>
                  <CardDescription>Banking and credit details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">Bank Name</TableCell>
                    <TableCell>{applicationData.financialInfo.bankName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Account Type</TableCell>
                    <TableCell>{applicationData.financialInfo.accountType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Account Number</TableCell>
                    <TableCell className="font-mono">{applicationData.financialInfo.accountNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Credit Score</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        {applicationData.financialInfo.creditScore}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bankruptcy History</TableCell>
                    <TableCell>{applicationData.financialInfo.bankruptcy}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Outstanding Debts</TableCell>
                    <TableCell>
                      {applicationData.financialInfo.outstandingDebts} - {applicationData.financialInfo.debtDetails}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Household Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Household Information</CardTitle>
                  <CardDescription>Occupants and pets</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">Number of Occupants</TableCell>
                    <TableCell>{applicationData.householdInfo.numberOfOccupants}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pets</TableCell>
                    <TableCell>{applicationData.householdInfo.pets}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pet Details</TableCell>
                    <TableCell>{applicationData.householdInfo.petDetails}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Smoking</TableCell>
                    <TableCell>{applicationData.householdInfo.smoking}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {applicationData.householdInfo.occupants.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div className="mb-3">
                    <h4 className="font-semibold text-foreground">Additional Occupants</h4>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Relationship</TableHead>
                        <TableHead>Age</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicationData.householdInfo.occupants.map((occupant, index) => (
                        <TableRow key={index}>
                          <TableCell>{occupant.name}</TableCell>
                          <TableCell>{occupant.relationship}</TableCell>
                          <TableCell>{occupant.age}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Vehicle Information</CardTitle>
                  <CardDescription>Registered vehicles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Make & Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>License Plate</TableHead>
                    <TableHead>State</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicationData.vehicles.map((vehicle, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {vehicle.make} {vehicle.model}
                      </TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.color}</TableCell>
                      <TableCell className="font-mono">{vehicle.licensePlate}</TableCell>
                      <TableCell>{vehicle.state}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Background Check */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Background Check</CardTitle>
                  <CardDescription>Criminal and eviction history</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">Criminal History</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        {applicationData.backgroundCheck.criminalHistory}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Eviction History</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        {applicationData.backgroundCheck.evictionHistory}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Consent to Background Check</TableCell>
                    <TableCell>{applicationData.backgroundCheck.consentToBackgroundCheck}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* References */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>References</CardTitle>
                  <CardDescription>Personal and professional references</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicationData.references.map((reference, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{reference.name}</TableCell>
                      <TableCell>{reference.relationship}</TableCell>
                      <TableCell>{reference.phone}</TableCell>
                      <TableCell>{reference.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Uploaded Documents</CardTitle>
                  <CardDescription>Supporting documentation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">ID Document</TableCell>
                    <TableCell>
                      <Button variant="link" className="h-auto p-0 text-primary">
                        {applicationData.uploads.idDocument}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Proof of Income</TableCell>
                    <TableCell>
                      <Button variant="link" className="h-auto p-0 text-primary">
                        {applicationData.uploads.proofOfIncome}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bank Statements</TableCell>
                    <TableCell>
                      <Button variant="link" className="h-auto p-0 text-primary">
                        {applicationData.uploads.bankStatements}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">References</TableCell>
                    <TableCell>
                      <Button variant="link" className="h-auto p-0 text-primary">
                        {applicationData.uploads.references}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Authorization */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Authorization & Consent</CardTitle>
                  <CardDescription>Applicant signature and agreements</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">Signature</TableCell>
                    <TableCell className="font-serif text-xl">{applicationData.authorization.signature}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Date Signed</TableCell>
                    <TableCell>{applicationData.authorization.date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Consent to Credit Check</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        {applicationData.authorization.consentToCredit}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Consent to Contact References</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        {applicationData.authorization.consentToContact}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
