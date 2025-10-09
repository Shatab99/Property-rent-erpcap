export interface PropertyApplication {
    id: string
    userId?: string | null
    propertyId?: string | null
    fullName: string
    email: string
    phone: string
    dob: string
    ssn: string
    driverLicense: string
    propertyAddress: string
    moveInDate: string
    leaseTerm: string
    monthlyRent: string
    unitNumber: string
    securityDeposit: string
    currentAddress: string
    lengthOfStay: string
    reasonForLeaving: string
    landlordName: string
    landlordContact: string
    monthlyRentPaid: string
    employerName: string
    jobTitle: string
    employerAddress: string
    workPhone: string
    monthlyIncome: string
    lengthEmployment: string
    proofEmploymentImageUrl: string
    creditScore: string
    bankName: string
    accountType: string
    numOccupants: string
    additionalOccupantName: string
    additionalOccupantAge: string
    relationshipWithApplicant: string
    pets: boolean
    petType?: string | null
    petWeight?: string | null
    petDeposit?: string | null
    vehicleMake: string
    vehicleModel: string
    vehicleYear: string
    vehicleColor: string
    vehiclePlate: string
    vehicleState: string
    evicted: string
    evictionExplain?: string | null
    brokenLease: string
    leaseExplain?: string | null
    conviction: string
    convictionExplain?: string | null
    referenceName: string
    relationshipWithReference: string
    referenceContact: string
    referenceEmail: string
    digitalSignature: string
    applicationDate: string
    govtIdImageUrl: string
    payStubImageUrl: string
    rentalImageUrl: string
    petRecordImageUrl: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAt: string
    updatedAt: string
    property?: any | null
    appliedAt: string
}