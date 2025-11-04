"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, MapPin, Home, Bed, Bath, Ruler, Calendar, User, Phone, Mail, Building } from "lucide-react"
import api from "@/lib/baseurl"
import Image from "next/image"
import { toastError } from "@/lib/toast"

interface PropertyDetails {
    id: string
    listingKey: string
    propertyId: string
    title: string
    description: string
    propertyType: string
    propertySubType: string
    price: number
    originalPrice: number
    securityDeposit: number | null
    bedrooms: number
    bathrooms: number
    bathroomsFull: number
    bathroomsHalf: number
    area: number
    lotSizeSquareFeet: number | null
    yearBuilt: number
    address: string
    streetNumber: string
    streetName: string
    city: string
    stateOrProvince: string
    postalCode: string
    county: string
    canRent: boolean
    images: string[]
    photosCount: number
    amenities: string[]
    appliances: string[]
    heating: string[]
    cooling: string[]
    parking: string[]
    interiorFeatures: string[]
    exteriorFeatures: string[]
    mlsStatus: string
    listingDate: string
    daysOnMarket: number
    listAgentName: string
    listAgentEmail: string
    listAgentPhone: string
    listOfficeName: string
    listOfficePhone: string
    isVerified: boolean
}

interface PropertyDetailsProps {
    id: string
}

export default function PropertyDetailsAdmin({ id }: PropertyDetailsProps) {
    const [property, setProperty] = useState<PropertyDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const token = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null

    useEffect(() => {
        if (!id) return
        const fetchProperty = async () => {
            try {
                const res = await api.get(`/admin/property-details/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                if (res.data.success) {
                    setProperty(res.data.data)
                } else {
                    setError("Failed to load property details.")
                }
            } catch (err) {
                setError("Something went wrong while fetching data.")
                toastError("Failed to fetch property details")
            } finally {
                setLoading(false)
            }
        }
        fetchProperty()
    }, [id, token])

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )

    if (error)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-lg">{error}</div>
            </div>
        )

    if (!property)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-muted-foreground text-lg">No property found</div>
            </div>
        )

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground mb-2">{property.title}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <MapPin className="h-4 w-4" />
                                <span>{property.address}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Listing Key: {property.listingKey}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                                {property.mlsStatus}
                            </Badge>
                            {property.isVerified && (
                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                    Verified
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Bed className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{property?.bedrooms}</p>
                                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Bath className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{property?.bathrooms}</p>
                                    <p className="text-xs text-muted-foreground">Bathrooms</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {
                        property?.area &&
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <Ruler className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-2xl font-bold">{property?.area?.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">Sq Ft</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    }
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{property?.yearBuilt}</p>
                                    <p className="text-xs text-muted-foreground">Year Built</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Images Gallery */}
                {property.images && property.images.length > 0 && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Property Images</CardTitle>
                            <CardDescription>{property.images.length} photos available</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {property.images.slice(0, 8).map((image, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                                        <Image
                                            src={image}
                                            alt={`Property image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Description */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                    </CardContent>
                </Card>

                {/* Property Information */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Property Information</CardTitle>
                        <CardDescription>Details and specifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium w-1/3">Property Type</TableCell>
                                    <TableCell>{property.propertyType}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Property Sub Type</TableCell>
                                    <TableCell>{property.propertySubType}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Price</TableCell>
                                    <TableCell className="text-lg font-semibold text-green-600">${property.price.toLocaleString()}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Original Price</TableCell>
                                    <TableCell>${property.originalPrice.toLocaleString()}</TableCell>
                                </TableRow>
                                {property.securityDeposit && (
                                    <TableRow>
                                        <TableCell className="font-medium">Security Deposit</TableCell>
                                        <TableCell>${property.securityDeposit.toLocaleString()}</TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell className="font-medium">Can Rent</TableCell>
                                    <TableCell>
                                        <Badge className={property.canRent ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}>
                                            {property.canRent ? "Yes" : "No"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Address Details */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Address Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium w-1/3">Street Number</TableCell>
                                    <TableCell>{property.streetNumber}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Street Name</TableCell>
                                    <TableCell>{property.streetName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">City</TableCell>
                                    <TableCell>{property.city}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">State/Province</TableCell>
                                    <TableCell>{property.stateOrProvince}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Postal Code</TableCell>
                                    <TableCell>{property.postalCode}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">County</TableCell>
                                    <TableCell>{property.county}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Features */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Interior Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Interior Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {property.interiorFeatures.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {property.interiorFeatures.map((feature, index) => (
                                        <Badge key={index} variant="outline" className="bg-primary/5">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No interior features listed</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Exterior Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Exterior Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {property.exteriorFeatures.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {property.exteriorFeatures.map((feature, index) => (
                                        <Badge key={index} variant="outline" className="bg-primary/5">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No exterior features listed</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Systems & Utilities */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Heating */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Heating</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {property.heating.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {property.heating.map((item, index) => (
                                        <Badge key={index} variant="outline" className="bg-orange-500/10 text-orange-700">
                                            {item}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Not specified</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cooling */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Cooling</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {property.cooling.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {property.cooling.map((item, index) => (
                                        <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-700">
                                            {item}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Not specified</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Parking */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Parking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {property.parking.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {property.parking.map((item, index) => (
                                        <Badge key={index} variant="outline" className="bg-purple-500/10 text-purple-700">
                                            {item}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Not specified</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Listing Information */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Listing Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium w-1/3">MLS Status</TableCell>
                                    <TableCell>{property.mlsStatus}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Listing Date</TableCell>
                                    <TableCell>{new Date(property.listingDate).toLocaleDateString()}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Days on Market</TableCell>
                                    <TableCell>{property.daysOnMarket}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Listing Agent */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-primary" />
                            <div>
                                <CardTitle>Listing Agent</CardTitle>
                                <CardDescription>Agent contact information</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium w-1/3">Agent Name</TableCell>
                                    <TableCell>{property.listAgentName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Email</TableCell>
                                    <TableCell>
                                        <a href={`mailto:${property.listAgentEmail}`} className="text-primary hover:underline">
                                            {property.listAgentEmail}
                                        </a>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Phone</TableCell>
                                    <TableCell>
                                        <a href={`tel:${property.listAgentPhone}`} className="text-primary hover:underline">
                                            {property.listAgentPhone}
                                        </a>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Listing Office */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Building className="h-5 w-5 text-primary" />
                            <div>
                                <CardTitle>Listing Office</CardTitle>
                                <CardDescription>Office contact information</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium w-1/3">Office Name</TableCell>
                                    <TableCell>{property.listOfficeName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Phone</TableCell>
                                    <TableCell>
                                        <a href={`tel:${property.listOfficePhone}`} className="text-primary hover:underline">
                                            {property.listOfficePhone}
                                        </a>
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
