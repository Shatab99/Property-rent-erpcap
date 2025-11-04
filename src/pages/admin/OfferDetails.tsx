"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader, ChevronLeft, FileText, User, DollarSign, Home, CheckCircle, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import api from '@/lib/baseurl'
import { toastError, toastSuccess } from '@/lib/toast'

interface OfferDetails {
    id: string
    userId: string
    fullName: string
    email: string
    phone: string
    verifiedId: string
    isKycVerified: boolean
    offerAmount: number
    downPayment: number
    proofOfFunds: string
    bankLetterUrl: string
    listingKey: string
    propertyAddress: string
    agentId: string | null
    contingencies: string[]
    closingDatePreference: string
    depositAmount: number
    proofOfIncomeUrl: string
    additionalDocument: string
    message: string | null
    buyersAgentName: string | null
    buyersAgentEmail: string | null
    buyersAgentPhone: string | null
    agentComments: string | null
    digitalSignature: string
    consentAcknowledged: boolean
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN'
    createdAt: string
    updatedAt: string
}

export default function OfferDetails({ id }: { id: string }) {
    const [offer, setOffer] = useState<OfferDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const router = useRouter()
    const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null;

    useEffect(() => {
        fetchOfferDetails()
    }, [id])

    const fetchOfferDetails = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/admin/offer-application/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success && response.data.data) {
                setOffer(response.data.data)
            } else {
                toastError('❌ Failed to load offer details')
                router.push('/admin/offers')
            }
        } catch (error: any) {
            toastError('❌ Error fetching offer details')
            console.error('Error:', error)
            router.push('/admin/offers')
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800'
            case 'APPROVED':
                return 'bg-green-100 text-green-800'
            case 'REJECTED':
                return 'bg-red-100 text-red-800'
            case 'WITHDRAWN':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="h-5 w-5" />
            case 'APPROVED':
                return <CheckCircle className="h-5 w-5" />
            default:
                return null
        }
    }

    const handleApproveOffer = async () => {
        setActionLoading(true)
        try {
            const response = await api.put(
                `/admin/update-offer-application/${id}`,
                { status: "APPROVED" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.data.success) {
                toastSuccess('✅ Offer approved successfully!')
                // Refetch offer details
                fetchOfferDetails()
            } else {
                toastError('❌ Failed to approve offer')
            }
        } catch (error: any) {
            toastError('❌ Error approving offer')
            console.error('Error:', error)
        } finally {
            setActionLoading(false)
        }
    }

    const handleRejectOffer = async () => {
        setActionLoading(true)
        try {
            const response = await api.put(
                `/admin/update-offer-application/${id}`,
                { status: "REJECTED" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.data.success) {
                toastSuccess('✅ Offer rejected successfully!')
                // Refetch offer details
                fetchOfferDetails()
            } else {
                toastError('❌ Failed to reject offer')
            }
        } catch (error: any) {
            toastError('❌ Error rejecting offer')
            console.error('Error:', error)
        } finally {
            setActionLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading offer details...</p>
                </div>
            </div>
        )
    }

    if (!offer) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
                <div className="max-w-4xl mx-auto">
                    <Button onClick={() => router.push('/admin/offers')} variant="outline" className="gap-2 mb-4">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Offers
                    </Button>
                    <Card>
                        <CardContent className="py-12">
                            <p className="text-center text-muted-foreground">Offer not found</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header with Back Button */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Button onClick={() => router.push('/admin/offers')} variant="outline" className="gap-2 mb-4">
                            <ChevronLeft className="h-4 w-4" />
                            Back to Offers
                        </Button>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Offer Details</h1>
                        <p className="text-muted-foreground mb-4">ID: {offer.id}</p>
                        <div className="flex gap-3">
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={handleApproveOffer}
                                disabled={actionLoading || offer.status === 'APPROVED'}
                            >
                                {actionLoading ? (
                                    <>
                                        <Loader className="h-4 w-4 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Approve Offer'
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={handleRejectOffer}
                                disabled={actionLoading || offer.status === 'REJECTED'}
                            >
                                {actionLoading ? (
                                    <>
                                        <Loader className="h-4 w-4 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Reject Offer'
                                )}
                            </Button>

                        </div>
                    </div>
                    <div className='flex flex-col items-end gap-8'>
                        <div className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${getStatusColor(offer.status)}`}>
                            {getStatusIcon(offer.status)}
                            {offer.status}
                        </div>
                        <Button

                            onClick={() => router.push(`/admin/property-details/${offer.listingKey}`)}
                        >
                            View Property
                        </Button>
                    </div>
                </div>

                {/* Applicant Information */}
                <Card className="mb-6">
                    <CardHeader className="bg-muted/50 border-b">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle>Applicant Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Full Name</p>
                                <p className="text-foreground font-semibold">{offer.fullName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                                <p className="text-foreground font-semibold break-all">{offer.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                                <p className="text-foreground font-semibold">{offer.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">User ID</p>
                                <p className="text-foreground font-semibold text-sm break-all">{offer.userId}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Property Information */}
                <Card className="mb-6">
                    <CardHeader className="bg-muted/50 border-b">
                        <div className="flex items-center gap-2">
                            <Home className="h-5 w-5 text-primary" />
                            <CardTitle>Property Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Property Address</p>
                                <p className="text-foreground font-semibold">{offer.propertyAddress}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Listing Key</p>
                                    <p className="text-foreground font-semibold">{offer.listingKey}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Closing Date Preference</p>
                                    <p className="text-foreground font-semibold">{new Date(offer.closingDatePreference).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial Information */}
                <Card className="mb-6">
                    <CardHeader className="bg-muted/50 border-b">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <CardTitle>Financial Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-primary/5 p-4 rounded-lg border">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Offer Amount</p>
                                <p className="text-2xl font-bold text-primary">${offer.offerAmount.toLocaleString()}</p>
                            </div>
                            <div className="bg-accent/5 p-4 rounded-lg border">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Down Payment</p>
                                <p className="text-2xl font-bold text-slate-500">{offer.downPayment}%</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Deposit Amount</p>
                                <p className="text-foreground font-semibold text-lg">${offer.depositAmount.toLocaleString()}</p>
                            </div>
                            {/* <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">KYC Verification</p>
                                <div className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${offer.isKycVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <p className="text-foreground font-semibold">{offer.isKycVerified ? 'Verified' : 'Not Verified'}</p>
                                </div>
                            </div> */}
                        </div>
                    </CardContent>
                </Card>

                {/* Contingencies */}
                <Card className="mb-6">
                    <CardHeader className="bg-muted/50 border-b">
                        <CardTitle>Contingencies</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-2">
                            {offer.contingencies && offer.contingencies.length > 0 ? (
                                offer.contingencies.map((contingency, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                    >
                                        {contingency}
                                    </span>
                                ))
                            ) : (
                                <p className="text-muted-foreground">No contingencies</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Documents */}
                <Card className="mb-6">
                    <CardHeader className="bg-muted/50 border-b">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <CardTitle>Documents</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {[
                                { label: 'Verified ID', url: offer.verifiedId },
                                { label: 'Proof of Funds', url: offer.proofOfFunds },
                                { label: 'Bank Letter', url: offer.bankLetterUrl },
                                { label: 'Proof of Income', url: offer.proofOfIncomeUrl },
                                { label: 'Additional Document', url: offer.additionalDocument },
                            ].map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium text-foreground">{doc.label}</p>
                                    </div>
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline font-medium text-sm"
                                    >
                                        View
                                    </a>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Agent Information (if available) */}
                {(offer.buyersAgentName || offer.buyersAgentEmail || offer.buyersAgentPhone) && (
                    <Card className="mb-6">
                        <CardHeader className="bg-muted/50 border-b">
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                <CardTitle>Buyer&apos;s Agent Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {offer.buyersAgentName && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Agent Name</p>
                                        <p className="text-foreground font-semibold">{offer.buyersAgentName}</p>
                                    </div>
                                )}
                                {offer.buyersAgentEmail && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Agent Email</p>
                                        <p className="text-foreground font-semibold break-all">{offer.buyersAgentEmail}</p>
                                    </div>
                                )}
                                {offer.buyersAgentPhone && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Agent Phone</p>
                                        <p className="text-foreground font-semibold">{offer.buyersAgentPhone}</p>
                                    </div>
                                )}
                                {offer.agentComments && (
                                    <div className="col-span-full">
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Comments</p>
                                        <p className="text-foreground">{offer.agentComments}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Signature & Consent */}
                <Card className="mb-6">
                    <CardHeader className="bg-muted/50 border-b">
                        <CardTitle>Signature & Consent</CardTitle>
                        <CardDescription>Legal acknowledgment and digital signature verification</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            {/* Digital Signature Display */}
                            <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 bg-primary/5">
                                <div className="text-center">
                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Digital Signature</p>
                                        <div className="inline-block bg-white border-2 border-primary rounded-lg px-8 py-6">
                                            <p className="text-lg font-bold text-primary italic font-serif">{offer.digitalSignature}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3">Signature provided by applicant on {new Date(offer.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Legal Notice */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <div className="text-amber-600 text-xl mt-0.5">⚠️</div>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-900 mb-1">Legal Notice</p>
                                        <p className="text-xs text-amber-800 leading-relaxed">
                                            This offer application contains legally binding terms and conditions. The digital signature above serves as proof of acceptance and acknowledgment. All information provided is certified to be true and accurate to the best of the applicant&apos;s knowledge.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Signature Verification Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Signature Date</p>
                                    <p className="text-sm font-medium text-blue-900">{new Date(offer.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-xs text-blue-700 mt-1">{new Date(offer.createdAt).toLocaleTimeString()}</p>
                                </div>
                                
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-lg p-4">
                                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2">Signed By</p>
                                    <p className="text-sm font-medium text-purple-900">{offer.fullName}</p>
                                    <p className="text-xs text-purple-700 mt-1">{offer.email}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metadata */}
                <Card>
                    <CardHeader className="bg-muted/50 border-b">
                        <CardTitle>Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Created At</p>
                                <p className="text-foreground font-semibold">{new Date(offer.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Updated At</p>
                                <p className="text-foreground font-semibold">{new Date(offer.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
