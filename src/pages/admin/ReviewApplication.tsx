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
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import api, { baseURL } from "@/lib/baseurl"
import { PropertyApplication } from "@/lib/applictionTypes"
import Image from "next/image"
import { toastError, toastSuccess } from "@/lib/toast"

export default function ReviewApplication({ id, token }: { id: string, token: string }) {

  const [application, setApplication] = useState<PropertyApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchApplication = async () => {
    try {
      const res = await fetch(`${baseURL}/admin/property-application/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      const data = await res.json()
      if (data.success) {
        setApplication(data.data)
      } else {
        setError("Failed to load application.")
      }
    } catch (err) {
      setError("Something went wrong while fetching data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    // const fetchApplication = async () => {
    //   try {
    //     const res = await fetch(`${baseURL}/admin/property-application/${id}`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       }
    //     })
    //     const data = await res.json()
    //     if (data.success) {
    //       setApplication(data.data)
    //     } else {
    //       setError("Failed to load application.")
    //     }
    //   } catch (err) {
    //     setError("Something went wrong while fetching data.")
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    fetchApplication()
  }, [id])

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )

  const applicationData = {
    status: application?.status || "PENDING",
    submittedDate: application?.appliedAt || "N/A",
    applicationId: application?.id,

    // Applicant Info
    applicantInfo: {
      fullName: application?.fullName || "N/A",
      email: application?.email || "N/A",
      phone: application?.phone || "N/A",
      dateOfBirth: application?.dob || "N/A",
      ssn: application?.ssn || "N/A",
      driversLicense: application?.driverLicense || "N/A",
    },

    // Property Details
    propertyDetails: {
      propertyAddress: application?.propertyAddress,
      desiredMoveInDate: application?.moveInDate,
      leaseTerm: application?.leaseTerm,
      monthlyRent: application?.monthlyRent,
    },

    // Residential History
    residentialHistory: [
      {
        address: application?.currentAddress || "N/A",
        moveInDate: application?.moveInDate || "N/A",
        monthlyRent: application?.monthlyRent || "N/A",
        landlordName: application?.landlordName || "N/A",
        landlordPhone: application?.landlordContact || "N/A",
        reasonForLeaving: application?.reasonForLeaving || "N/A",
      }
    ],

    // Employment Info
    employmentInfo: {
      employmentStatus: "Employed",
      employerName: application?.employerName || "N/A",
      jobTitle: application?.jobTitle || "N/A",
      employmentDuration: application?.lengthEmployment || "N/A",
      supervisorName: application?.referenceName || "N/A",
      supervisorPhone: application?.referenceContact || "N/A",
      monthlyIncome: application?.monthlyIncome
    },

    // Financial Info
    financialInfo: {
      bankName: application?.bankName || "N/A",
      accountType: application?.accountType || "N/A",
      creditScore: application?.creditScore || "N/A",
    },

    // Household Info
    householdInfo: {
      numberOfOccupants: application?.numOccupants || "N/A",
      occupants: [{ name: application?.additionalOccupantName, relationship: application?.relationshipWithApplicant, age: application?.additionalOccupantAge }],
      pets: application?.pets ? "Yes" : "No",
      petDetails: application?.petDeposit || "N/A",
      petType: application?.petType || "N/A",
      petWeight: application?.petWeight || "N/A",
    },

    // Vehicle Info
    vehicles: [
      {
        make: application?.vehicleMake || "N/A",
        model: application?.vehicleModel || "N/A",
        year: application?.vehicleYear || "N/A",
        color: application?.vehicleColor || "N/A",
        licensePlate: application?.vehiclePlate || "N/A",
        state: application?.vehicleState || "N/A",
      },
    ],

    // Background Check
    backgroundCheck: {
      criminalHistory: application?.conviction || "N/A",
      criminalDetails: application?.convictionExplain || "N/A",
      evictionHistory: application?.evicted || "N/A",
      evictionDetails: application?.evictionExplain || "N/A",
      brokenLease: application?.brokenLease || "N/A",
      leaseExplain: application?.leaseExplain || "N/A",
    },

    // References
    references: [
      {
        name: application?.referenceName,
        relationship: application?.relationshipWithReference || "N/A",
        phone: application?.referenceContact || "N/A",
        email: application?.referenceEmail || "N/A",
      }
    ],

    // Authorization
    authorization: {
      signature: application?.digitalSignature || "N/A",
      date: application?.appliedAt || "N/A",
      consentToCredit: "Yes",
      consentToContact: "Yes",
    },

    // Uploads
    uploads: {
      idDocument: application?.govtIdImageUrl,
      proofOfIncome: application?.payStubImageUrl,
      bankStatements: application?.proofEmploymentImageUrl,
      rentalImage: application?.rentalImageUrl,
      petRecords: application?.petRecordImageUrl,
    },
  }

  const handleApprove = async () => {
    if (!id) return
    setBtnLoading(true)
    try {
      const res = await api.put(`${baseURL}/admin/update-application/${id}`, {
        status: "APPROVED"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toastSuccess("Application approved successfully.")
    }
    catch {
      toastError("Failed to approve application.")
    }
    finally {
      setBtnLoading(false)
      fetchApplication()
    }
  }


  const handleReject = async () => {
    if (!id) return
    setBtnLoading(true)
    try {
      const res = await api.put(`${baseURL}/admin/update-application/${id}`, {
        status: "REJECTED"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toastSuccess("Application rejected successfully.")
    }
    catch {
      toastError("Failed to reject application.")
    }
    finally {
      setBtnLoading(false)
      fetchApplication()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>
      case "REJECTED":
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

        {/* Admin Actions */}
        <div className="ml-auto flex items-center gap-3">
          <Button
            onClick={handleApprove}
            disabled={btnLoading || applicationData.status === "APPROVED"}
            variant="outline"
            className="gap-2 border-green-500/20 text-green-500 hover:bg-green-500/10 bg-transparent"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve
          </Button>
          <Button
            onClick={handleReject}
            disabled={btnLoading || applicationData.status === "REJECTED"}
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
                    {applicationData.applicantInfo.fullName}
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
                    {applicationData.applicantInfo.driversLicense}
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
                    <h4 className="font-semibold text-foreground mb-1">Residence </h4>
                    <p className="text-sm text-muted-foreground">{residence.address}</p>
                  </div>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">Duration</TableCell>
                        <TableCell>
                          {residence.moveInDate}
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
                  <TableCell className="font-medium">Credit Score</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {applicationData.financialInfo.creditScore}
                    </Badge>
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
                  <TableCell className="font-medium">Pet Deposit</TableCell>
                  <TableCell>{applicationData.householdInfo.petDetails}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pet Type</TableCell>
                  <TableCell>{applicationData.householdInfo.petType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pet Weight</TableCell>
                  <TableCell>{applicationData.householdInfo.petWeight}</TableCell>
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
                  <TableCell className="font-medium">Eviction</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {applicationData.backgroundCheck.evictionHistory}
                    </Badge>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Eviction History</TableCell>
                  <TableCell>
                    {applicationData.backgroundCheck.evictionDetails}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Criminal</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {applicationData.backgroundCheck.criminalHistory}
                    </Badge>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Criminal History</TableCell>
                  <TableCell>
                    {applicationData.backgroundCheck.criminalDetails}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Broken Lease ?</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {applicationData.backgroundCheck.brokenLease}
                    </Badge>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Broken Lease History</TableCell>
                  <TableCell>
                    {applicationData.backgroundCheck.leaseExplain}

                  </TableCell>
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
                    <Link href={applicationData.uploads.idDocument || '/placeholder-image.png'}
                    >
                      <Button variant="link" className="h-auto p-0 text-primary">
                        {applicationData.uploads.idDocument}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Proof of Income</TableCell>
                  <TableCell>
                    <Link href={applicationData.uploads.proofOfIncome || '/placeholder-image.png'}
                    >
                      <Button variant="link" className="h-auto p-0 text-primary">
                        {applicationData.uploads.proofOfIncome}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bank Statements</TableCell>
                  <TableCell>
                    <Link href={applicationData.uploads.bankStatements || '/placeholder-image.png'}
                    >
                      <Button variant="link" className="h-auto p-0 text-primary">
                        {applicationData.uploads.bankStatements}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Proof of Giving Rent</TableCell>
                  <TableCell>
                    <Link href={applicationData.uploads.rentalImage || '/placeholder-image.png'}
                    >
                      <Button variant="link" className="h-auto p-0 text-primary">
                        {applicationData.uploads.rentalImage || "N/A"}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pet Record Statement</TableCell>
                  <TableCell>
                    <Link href={applicationData.uploads.petRecords || '/placeholder-image.png'}
                    >
                      <Button variant="link" className="h-auto p-0 text-primary">
                        {applicationData.uploads.petRecords || "N/A"}
                      </Button>
                    </Link>
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
  )
}
