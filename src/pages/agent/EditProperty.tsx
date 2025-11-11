"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Loader2, Upload, ArrowLeft } from 'lucide-react'
import api from '@/lib/baseurl'
import { toastError, toastSuccess } from '@/lib/toast'
import { sanitizeSearchInput } from '@/lib/sanitizeSearchInput'
import { useRouter, useParams } from 'next/navigation'
import { getToken } from '@/lib/getToken'

interface PropertyData {
    // Basic Info
    title: string
    description: string
    propertyType: string
    propertySubType?: string

    // Pricing
    price: number
    originalPrice?: number
    securityDeposit?: string
    taxAmount?: number
    canRent: boolean

    // Physical Details
    bedrooms?: number
    bathrooms?: number
    bathroomsFull?: number
    bathroomsHalf?: number
    area?: number
    lotSizeAcres?: number
    lotSizeSquareFeet?: number
    yearBuilt?: number
    storiesTotal?: number

    // Location
    address: string
    streetNumber?: string
    streetName?: string
    city?: string
    stateOrProvince?: string
    postalCode?: string
    county?: string
    latitude?: number
    longitude?: number

    // Media
    images: string[]
    photosCount?: number

    // Features & Amenities
    amenities: string[]
    appliances: string[]
    heating: string[]
    cooling: string[]
    parking: string[]
    interiorFeatures: string[]
    exteriorFeatures: string[]

    // HOA & Community
    associationFee?: number
    associationFeeFrequency?: string
    communityFeatures: string[]
    seniorCommunityYN?: boolean

    // Listing Details
    daysOnMarket?: number

    // Agent/Office Info
    listAgentName?: string
    listAgentEmail?: string
    listAgentPhone?: string
    listOfficeName?: string
    listOfficePhone?: string
}

const propertyTypeOptions = ["Residential", "Residential Lease", "Residential Income", "Commercial Sale", "Land"];
const propertySubtypeOptions = ["Condominium", "Stock Cooperative", "Single Family Residence", "Duplex", "Apartment", "Multi Family", "Retail", "Business", "Warehouse", "Manufactured Home", "Mixed Use"];

export default function EditProperty({id} :{ id: string }) {
    const router = useRouter()
    const token = getToken()

    const [formData, setFormData] = useState<PropertyData>({
        title: '',
        description: '',
        propertyType: '',
        propertySubType: '',
        price: 0,
        originalPrice: undefined,
        securityDeposit: '',
        taxAmount: undefined,
        canRent: false,
        bedrooms: undefined,
        bathrooms: undefined,
        bathroomsFull: undefined,
        bathroomsHalf: undefined,
        area: undefined,
        lotSizeAcres: undefined,
        lotSizeSquareFeet: undefined,
        yearBuilt: undefined,
        storiesTotal: undefined,
        address: '',
        streetNumber: '',
        streetName: '',
        city: '',
        stateOrProvince: '',
        postalCode: '',
        county: '',
        latitude: undefined,
        longitude: undefined,
        images: [],
        photosCount: undefined,
        amenities: [],
        appliances: [],
        heating: [],
        cooling: [],
        parking: [],
        interiorFeatures: [],
        exteriorFeatures: [],
        associationFee: undefined,
        associationFeeFrequency: 'Monthly',
        communityFeatures: [],
        seniorCommunityYN: false,
        daysOnMarket: undefined,
        listAgentName: '',
        listAgentEmail: '',
        listAgentPhone: '',
        listOfficeName: '',
        listOfficePhone: '',
    })

    const [newFeature, setNewFeature] = useState<{ [key: string]: string }>({
        amenities: '',
        appliances: '',
        heating: '',
        cooling: '',
        parking: '',
        interiorFeatures: '',
        exteriorFeatures: '',
        communityFeatures: '',
    })

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [newImages, setNewImages] = useState<File[]>([])

    // Fetch property data on component mount
    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                setIsLoadingData(true)
                const response = await api.get(`/agent/single-property/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (response.data?.success && response.data.data) {
                    const propertyData = response.data.data
                    setFormData({
                        title: propertyData.title || '',
                        description: propertyData.description || '',
                        propertyType: propertyData.propertyType || '',
                        propertySubType: propertyData.propertySubType || '',
                        price: propertyData.price || 0,
                        originalPrice: propertyData.originalPrice,
                        securityDeposit: propertyData.securityDeposit || '',
                        taxAmount: propertyData.taxAmount,
                        canRent: propertyData.canRent || false,
                        bedrooms: propertyData.bedrooms,
                        bathrooms: propertyData.bathrooms,
                        bathroomsFull: propertyData.bathroomsFull,
                        bathroomsHalf: propertyData.bathroomsHalf,
                        area: propertyData.area,
                        lotSizeAcres: propertyData.lotSizeAcres,
                        lotSizeSquareFeet: propertyData.lotSizeSquareFeet,
                        yearBuilt: propertyData.yearBuilt,
                        storiesTotal: propertyData.storiesTotal,
                        address: propertyData.address || '',
                        streetNumber: propertyData.streetNumber || '',
                        streetName: propertyData.streetName || '',
                        city: propertyData.city || '',
                        stateOrProvince: propertyData.stateOrProvince || '',
                        postalCode: propertyData.postalCode || '',
                        county: propertyData.county || '',
                        latitude: propertyData.latitude,
                        longitude: propertyData.longitude,
                        images: propertyData.images || [],
                        photosCount: propertyData.photosCount,
                        amenities: propertyData.amenities || [],
                        appliances: propertyData.appliances || [],
                        heating: propertyData.heating || [],
                        cooling: propertyData.cooling || [],
                        parking: propertyData.parking || [],
                        interiorFeatures: propertyData.interiorFeatures || [],
                        exteriorFeatures: propertyData.exteriorFeatures || [],
                        associationFee: propertyData.associationFee,
                        associationFeeFrequency: propertyData.associationFeeFrequency || 'Monthly',
                        communityFeatures: propertyData.communityFeatures || [],
                        seniorCommunityYN: propertyData.seniorCommunityYN || false,
                        daysOnMarket: propertyData.daysOnMarket,
                        listAgentName: propertyData.listAgentName || '',
                        listAgentEmail: propertyData.listAgentEmail || '',
                        listAgentPhone: propertyData.listAgentPhone || '',
                        listOfficeName: propertyData.listOfficeName || '',
                        listOfficePhone: propertyData.listOfficePhone || '',
                    })
                }
            } catch (error) {
                console.error('Failed to fetch property data:', error)
                toastError('Failed to load property data.')
                router.push('/agent/listings')
            } finally {
                setIsLoadingData(false)
            }
        }

        fetchPropertyData()
    }, [id, token])

    const refetchPropertyData = async () => {
        try {
            const response = await api.get(`/agent/single-property/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (response.data?.success && response.data.data) {
                const propertyData = response.data.data
                setFormData({
                    title: propertyData.title || '',
                    description: propertyData.description || '',
                    propertyType: propertyData.propertyType || '',
                    propertySubType: propertyData.propertySubType || '',
                    price: propertyData.price || 0,
                    originalPrice: propertyData.originalPrice,
                    securityDeposit: propertyData.securityDeposit || '',
                    taxAmount: propertyData.taxAmount,
                    canRent: propertyData.canRent || false,
                    bedrooms: propertyData.bedrooms,
                    bathrooms: propertyData.bathrooms,
                    bathroomsFull: propertyData.bathroomsFull,
                    bathroomsHalf: propertyData.bathroomsHalf,
                    area: propertyData.area,
                    lotSizeAcres: propertyData.lotSizeAcres,
                    lotSizeSquareFeet: propertyData.lotSizeSquareFeet,
                    yearBuilt: propertyData.yearBuilt,
                    storiesTotal: propertyData.storiesTotal,
                    address: propertyData.address || '',
                    streetNumber: propertyData.streetNumber || '',
                    streetName: propertyData.streetName || '',
                    city: propertyData.city || '',
                    stateOrProvince: propertyData.stateOrProvince || '',
                    postalCode: propertyData.postalCode || '',
                    county: propertyData.county || '',
                    latitude: propertyData.latitude,
                    longitude: propertyData.longitude,
                    images: propertyData.images || [],
                    photosCount: propertyData.photosCount,
                    amenities: propertyData.amenities || [],
                    appliances: propertyData.appliances || [],
                    heating: propertyData.heating || [],
                    cooling: propertyData.cooling || [],
                    parking: propertyData.parking || [],
                    interiorFeatures: propertyData.interiorFeatures || [],
                    exteriorFeatures: propertyData.exteriorFeatures || [],
                    associationFee: propertyData.associationFee,
                    associationFeeFrequency: propertyData.associationFeeFrequency || 'Monthly',
                    communityFeatures: propertyData.communityFeatures || [],
                    seniorCommunityYN: propertyData.seniorCommunityYN || false,
                    daysOnMarket: propertyData.daysOnMarket,
                    listAgentName: propertyData.listAgentName || '',
                    listAgentEmail: propertyData.listAgentEmail || '',
                    listAgentPhone: propertyData.listAgentPhone || '',
                    listOfficeName: propertyData.listOfficeName || '',
                    listOfficePhone: propertyData.listOfficePhone || '',
                })
                setNewImages([])
            }
        } catch (error) {
            console.error('Failed to refetch property data:', error)
            toastError('Failed to reload property data.')
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const inputElement = e.target as HTMLInputElement
        const isCheckbox = type === 'checkbox'

        setFormData(prev => {
            const updatedData = {
                ...prev,
                [name]: isCheckbox ? inputElement.checked : (name.includes('Price') || name.includes('Tax') || name.includes('Fee') || name.includes('Area') || name.includes('Lot') || name === 'bedrooms' || name === 'bathrooms' || name === 'bathroomsFull' || name === 'bathroomsHalf' || name === 'yearBuilt' || name === 'storiesTotal' || name === 'latitude' || name === 'longitude' || name === 'daysOnMarket') ? (value ? parseFloat(value) : undefined) : value
            }

            // Auto-generate address from components
            if (['streetNumber', 'city', 'stateOrProvince', 'postalCode'].includes(name)) {
                const addressParts = [
                    updatedData.streetNumber,
                    updatedData.city,
                    updatedData.stateOrProvince,
                    updatedData.postalCode
                ].filter(Boolean)
                updatedData.address = addressParts.join(', ')
            }

            return updatedData
        })
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const maxTotalImages = 8
            const currentTotal = formData.images.length + newImages.length
            const remainingSlots = maxTotalImages - currentTotal
            
            if (remainingSlots <= 0) {
                toastError(`You can only upload a maximum of ${maxTotalImages} images total. Please remove some existing or new images first.`)
                return
            }
            
            const filesToAdd = Array.from(files).slice(0, remainingSlots)
            
            if (filesToAdd.length < files.length) {
                toastError(`Only ${filesToAdd.length} image(s) can be added. You have ${currentTotal} images and can upload maximum ${maxTotalImages} total.`)
            }
            
            setNewImages(prev => [...prev, ...filesToAdd])
        }
    }

    const handleRemoveImage = (index: number, isNew: boolean) => {
        if (isNew) {
            setNewImages(prev => prev.filter((_, i) => i !== index))
        } else {
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index)
            }))
        }
    }

    const handleFeatureChange = (featureType: string, value: string) => {
        setNewFeature(prev => ({ ...prev, [featureType]: value }))
    }

    const handleAddFeature = (featureType: string) => {
        const value = newFeature[featureType]?.trim()
        if (value && !(formData[featureType as keyof PropertyData] as string[])?.includes(value)) {
            setFormData(prev => ({
                ...prev,
                [featureType]: [...(prev[featureType as keyof PropertyData] as string[]), value]
            }))
            setNewFeature(prev => ({ ...prev, [featureType]: '' }))
        }
    }

    const handleRemoveFeature = (featureType: string, item: string) => {
        setFormData(prev => ({
            ...prev,
            [featureType]: (prev[featureType as keyof PropertyData] as string[]).filter(f => f !== item)
        }))
    }

    console.log(formData)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setSuccessMessage('')
        setErrorMessage('')

        try {
            if (!formData.title.trim() || !formData.description.trim() || !formData.price) {
                setErrorMessage('Please fill in all required fields (Title, Description, Price)')
                setIsLoading(false)
                return
            }

            if (!formData.propertyType) {
                setErrorMessage('Please select a Property Type')
                setIsLoading(false)
                return
            }

            if (!formData.propertySubType) {
                setErrorMessage('Please select a Property Sub Type')
                setIsLoading(false)
                return
            }

            if (!formData.originalPrice) {
                setErrorMessage('Please enter an Original Price')
                setIsLoading(false)
                return
            }

            if (!formData.taxAmount) {
                setErrorMessage('Please enter a Tax Amount')
                setIsLoading(false)
                return
            }

            const form = new FormData()
            const bodyData: Record<string, any> = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                images: formData.images,
                propertyType: formData.propertyType,
                propertySubType: formData.propertySubType || null,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
                securityDeposit: formData.securityDeposit || null,
                taxAmount: formData.taxAmount ? Number(formData.taxAmount) : null,
                canRent: formData.canRent,
                bedrooms: formData.bedrooms !== undefined && formData.bedrooms !== null ? Number(formData.bedrooms) : null,
                bathrooms: formData.bathrooms !== undefined && formData.bathrooms !== null ? Number(formData.bathrooms) : null,
                bathroomsFull: formData.bathroomsFull !== undefined && formData.bathroomsFull !== null ? Number(formData.bathroomsFull) : null,
                bathroomsHalf: formData.bathroomsHalf !== undefined && formData.bathroomsHalf !== null ? Number(formData.bathroomsHalf) : null,
                area: formData.area !== undefined && formData.area !== null ? Number(formData.area) : null,
                lotSizeAcres: formData.lotSizeAcres !== undefined && formData.lotSizeAcres !== null ? Number(formData.lotSizeAcres) : null,
                lotSizeSquareFeet: formData.lotSizeSquareFeet !== undefined && formData.lotSizeSquareFeet !== null ? Number(formData.lotSizeSquareFeet) : 0,
                yearBuilt: formData.yearBuilt !== undefined && formData.yearBuilt !== null ? Number(formData.yearBuilt) : null,
                storiesTotal: formData.storiesTotal !== undefined && formData.storiesTotal !== null ? Number(formData.storiesTotal) : null,
                address: sanitizeSearchInput(formData.address),
                streetNumber: formData.streetNumber || '',
                streetName: formData.streetName || '',
                city: formData.city || null,
                stateOrProvince: formData.stateOrProvince || null,
                postalCode: formData.postalCode || null,
                county: formData.county || null,
                latitude: formData.latitude ? Number(formData.latitude) : null,
                longitude: formData.longitude ? Number(formData.longitude) : null,
                amenities: formData.amenities,
                appliances: formData.appliances,
                heating: formData.heating,
                cooling: formData.cooling,
                parking: formData.parking,
                interiorFeatures: formData.interiorFeatures,
                exteriorFeatures: formData.exteriorFeatures,
                associationFee: formData.associationFee ? Number(formData.associationFee) : null,
                associationFeeFrequency: formData.associationFeeFrequency || null,
                communityFeatures: formData.communityFeatures,
                seniorCommunityYN: formData.seniorCommunityYN || null,
                daysOnMarket: formData.daysOnMarket ? Number(formData.daysOnMarket) : null,
                listAgentName: formData.listAgentName || null,
                listAgentEmail: formData.listAgentEmail || null,
                listAgentPhone: formData.listAgentPhone || null,
                listOfficeName: formData.listOfficeName || null,
                listOfficePhone: formData.listOfficePhone || null,
            }

            // Append existing images
            formData.images.forEach((image: string) => {
                form.append('existingImages', image)
            })

            // Append new images as separate files
            newImages.forEach((image: File) => {
                form.append('images', image, image.name)
            })

            // Append JSON body data
            form.append('bodyData', JSON.stringify(bodyData))

            console.log('✅ Form Data:', {
                bodyData,
                existingImages: formData.images.length,
                newImages: newImages.length,
            })

            const response = await api.put(`/agent/edit-property/${id}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!response.data.success) {
                throw new Error('Failed to update property listing')
            }

            setSuccessMessage('Property listing updated successfully!')
            toastSuccess('Property listing updated successfully!')
            setNewImages([])
            
            // Refetch property data after successful update
            await refetchPropertyData()
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
            toastError(error instanceof Error ? error.message : 'An error occurred')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Loading property data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/agent/listings')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Properties
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Edit Property</h1>
                    <p className="text-slate-600 mt-2">Update the property listing information</p>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <CardTitle className="text-xl text-blue-900">Basic Information</CardTitle>
                            <CardDescription>Title and description of the property</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                                    Property Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Modern Downtown Apartment"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
                                    Description <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe the property in detail..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="min-h-32"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="propertyType" className="text-sm font-semibold text-slate-700">
                                        Property Type <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="propertyType"
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleInputChange}
                                        className="w-full h-10 px-3 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Select Property Type</option>
                                        {propertyTypeOptions.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="propertySubType" className="text-sm font-semibold text-slate-700">
                                        Property Sub Type <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="propertySubType"
                                        name="propertySubType"
                                        value={formData.propertySubType}
                                        onChange={handleInputChange}
                                        className="w-full h-10 px-3 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Select Property Sub Type</option>
                                        {propertySubtypeOptions.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    id="canRent"
                                    name="canRent"
                                    type="checkbox"
                                    checked={formData.canRent}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded border-slate-300"
                                />
                                <Label htmlFor="canRent" className="text-sm font-semibold text-slate-700 cursor-pointer">
                                    Can Rent
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image Upload */}
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl text-cyan-900">Images</CardTitle>
                                    <CardDescription>Upload or manage property images</CardDescription>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-cyan-900">
                                        {formData.images.length + newImages.length}/8 Images
                                    </p>
                                    <p className="text-xs text-slate-600">
                                        {8 - (formData.images.length + newImages.length)} slots available
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-center w-full">
                                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                        8 - (formData.images.length + newImages.length) <= 0
                                            ? 'border-slate-300 bg-slate-50 cursor-not-allowed opacity-50'
                                            : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                                    }`}>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 text-slate-500 mb-2" />
                                            <p className="text-sm text-slate-600">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={8 - (formData.images.length + newImages.length) <= 0}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {8 - (formData.images.length + newImages.length) <= 0 && (
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-sm text-amber-800 font-semibold">
                                            ⚠️ Maximum 8 images reached
                                        </p>
                                        <p className="text-xs text-amber-700 mt-1">
                                            Remove some existing or new images to upload more.
                                        </p>
                                    </div>
                                )}

                                {/* Existing Images */}
                                {formData.images.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-slate-700">Existing Images ({formData.images.length})</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {formData.images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={image}
                                                        alt={`property-${index}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index, false)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Images */}
                                {newImages.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-slate-700">New Images ({newImages.length})</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {newImages.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`new-${index}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index, true)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
                            <CardTitle className="text-xl text-green-900">Pricing</CardTitle>
                            <CardDescription>Property pricing and fees</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-sm font-semibold text-slate-700">
                                        Price <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        placeholder="2500"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="originalPrice" className="text-sm font-semibold text-slate-700">
                                        Original Price <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="originalPrice"
                                        name="originalPrice"
                                        type="number"
                                        placeholder="3500"
                                        value={formData.originalPrice || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="taxAmount" className="text-sm font-semibold text-slate-700">
                                        Tax Amount <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="taxAmount"
                                        name="taxAmount"
                                        type="number"
                                        placeholder="120"
                                        value={formData.taxAmount || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="securityDeposit" className="text-sm font-semibold text-slate-700">
                                        Security Deposit <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="securityDeposit"
                                        name="securityDeposit"
                                        type="text"
                                        placeholder="2 month rent"
                                        value={formData.securityDeposit}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="associationFee" className="text-sm font-semibold text-slate-700">
                                        Association Fee <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="associationFee"
                                        name="associationFee"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.associationFee || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Physical Details */}
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
                            <CardTitle className="text-xl text-purple-900">Physical Details</CardTitle>
                            <CardDescription>Property dimensions and specifications</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bedrooms" className="text-sm font-semibold text-slate-700">
                                        Bedrooms <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="bedrooms"
                                        name="bedrooms"
                                        type="number"
                                        placeholder="3"
                                        value={formData.bedrooms || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bathrooms" className="text-sm font-semibold text-slate-700">
                                        Bathrooms <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="bathrooms"
                                        name="bathrooms"
                                        type="number"
                                        placeholder="2"
                                        value={formData.bathrooms || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="area" className="text-sm font-semibold text-slate-700">
                                        Area (sq ft) <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="area"
                                        name="area"
                                        type="number"
                                        placeholder="1200"
                                        value={formData.area || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="yearBuilt" className="text-sm font-semibold text-slate-700">
                                        Year Built <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="yearBuilt"
                                        name="yearBuilt"
                                        type="number"
                                        placeholder="2023"
                                        value={formData.yearBuilt || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lotSizeAcres" className="text-sm font-semibold text-slate-700">
                                        Lot Size (Acres) <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="lotSizeAcres"
                                        name="lotSizeAcres"
                                        type="number"
                                        placeholder="1"
                                        value={formData.lotSizeAcres || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="storiesTotal" className="text-sm font-semibold text-slate-700">
                                        Stories <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="storiesTotal"
                                        name="storiesTotal"
                                        type="number"
                                        placeholder="1"
                                        value={formData.storiesTotal || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-orange-50 to-amber-50">
                            <CardTitle className="text-xl text-orange-900">Location</CardTitle>
                            <CardDescription>Address and coordinates</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-sm font-semibold text-slate-700">
                                    Full Address <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="123 Main St, City, State, ZIP"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    disabled
                                    className="h-10 bg-slate-100"
                                />
                                <p className="text-xs text-slate-500">Auto-generated from address components</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="streetNumber" className="text-sm font-semibold text-slate-700">
                                        Street Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="streetNumber"
                                        name="streetNumber"
                                        type="text"
                                        placeholder="123"
                                        value={formData.streetNumber}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-sm font-semibold text-slate-700">
                                        City <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        type="text"
                                        placeholder="New York"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stateOrProvince" className="text-sm font-semibold text-slate-700">
                                        State <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="stateOrProvince"
                                        name="stateOrProvince"
                                        type="text"
                                        placeholder="NY"
                                        value={formData.stateOrProvince}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="postalCode" className="text-sm font-semibold text-slate-700">
                                        Postal Code <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="postalCode"
                                        name="postalCode"
                                        type="text"
                                        placeholder="10001"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="streetName" className="text-sm font-semibold text-slate-700">
                                        Street Name <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="streetName"
                                        name="streetName"
                                        type="text"
                                        placeholder="Main Street"
                                        value={formData.streetName}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="county" className="text-sm font-semibold text-slate-700">
                                        County <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="county"
                                        name="county"
                                        type="text"
                                        placeholder="County"
                                        value={formData.county}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features & Amenities */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Amenities */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                                <CardTitle className="text-lg text-blue-900">Amenities</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Swimming Pool"
                                        value={newFeature.amenities || ''}
                                        onChange={(e) => handleFeatureChange('amenities', e.target.value)}
                                        className="h-10"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('amenities')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {(formData.amenities as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.amenities as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                                                onClick={() => handleRemoveFeature('amenities', item)}
                                            >
                                                {item} <X className="w-3 h-3 ml-1" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Appliances */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
                                <CardTitle className="text-lg text-purple-900">Appliances</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Dishwasher"
                                        value={newFeature.appliances || ''}
                                        onChange={(e) => handleFeatureChange('appliances', e.target.value)}
                                        className="h-10"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('appliances')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {(formData.appliances as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.appliances as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-purple-100 text-purple-800 cursor-pointer hover:bg-purple-200"
                                                onClick={() => handleRemoveFeature('appliances', item)}
                                            >
                                                {item} <X className="w-3 h-3 ml-1" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Heating */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-orange-50 to-red-50">
                                <CardTitle className="text-lg text-orange-900">Heating</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Central Heating"
                                        value={newFeature.heating || ''}
                                        onChange={(e) => handleFeatureChange('heating', e.target.value)}
                                        className="h-10"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('heating')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {(formData.heating as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.heating as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-orange-100 text-orange-800 cursor-pointer hover:bg-orange-200"
                                                onClick={() => handleRemoveFeature('heating', item)}
                                            >
                                                {item} <X className="w-3 h-3 ml-1" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Cooling */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-teal-50">
                                <CardTitle className="text-lg text-cyan-900">Cooling</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., AC"
                                        value={newFeature.cooling || ''}
                                        onChange={(e) => handleFeatureChange('cooling', e.target.value)}
                                        className="h-10"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('cooling')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {(formData.cooling as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.cooling as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-cyan-100 text-cyan-800 cursor-pointer hover:bg-cyan-200"
                                                onClick={() => handleRemoveFeature('cooling', item)}
                                            >
                                                {item} <X className="w-3 h-3 ml-1" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Parking */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-yellow-50 to-amber-50">
                                <CardTitle className="text-lg text-yellow-900">Parking</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Garage"
                                        value={newFeature.parking || ''}
                                        onChange={(e) => handleFeatureChange('parking', e.target.value)}
                                        className="h-10"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('parking')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {(formData.parking as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.parking as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-yellow-100 text-yellow-800 cursor-pointer hover:bg-yellow-200"
                                                onClick={() => handleRemoveFeature('parking', item)}
                                            >
                                                {item} <X className="w-3 h-3 ml-1" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Interior Features */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
                                <CardTitle className="text-lg text-green-900">Interior Features</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Hardwood Floors"
                                        value={newFeature.interiorFeatures || ''}
                                        onChange={(e) => handleFeatureChange('interiorFeatures', e.target.value)}
                                        className="h-10"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('interiorFeatures')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {(formData.interiorFeatures as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.interiorFeatures as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-green-100 text-green-800 cursor-pointer hover:bg-green-200"
                                                onClick={() => handleRemoveFeature('interiorFeatures', item)}
                                            >
                                                {item} <X className="w-3 h-3 ml-1" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Exterior Features */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                                <CardTitle className="text-lg text-indigo-900">Exterior Features</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Patio"
                                        value={newFeature.exteriorFeatures || ''}
                                        onChange={(e) => handleFeatureChange('exteriorFeatures', e.target.value)}
                                        className="h-10"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('exteriorFeatures')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {(formData.exteriorFeatures as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.exteriorFeatures as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-indigo-100 text-indigo-800 cursor-pointer hover:bg-indigo-200"
                                                onClick={() => handleRemoveFeature('exteriorFeatures', item)}
                                            >
                                                {item} <X className="w-3 h-3 ml-1" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Community Features */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-rose-50 to-pink-50">
                                <CardTitle className="text-lg text-rose-900">Community Features</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Gated Community"
                                        value={newFeature.communityFeatures || ''}
                                        onChange={(e) => handleFeatureChange('communityFeatures', e.target.value)}
                                        className="h-10"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('communityFeatures')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {(formData.communityFeatures as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.communityFeatures as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-rose-100 text-rose-800 cursor-pointer hover:bg-rose-200"
                                                onClick={() => handleRemoveFeature('communityFeatures', item)}
                                            >
                                                {item} <X className="w-3 h-3 ml-1" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Agent & Office Info */}
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                            <CardTitle className="text-xl text-emerald-900">Agent & Office Info</CardTitle>
                            <CardDescription>Listing agent and office information</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="listAgentName" className="text-sm font-semibold text-slate-700">
                                        Agent Name
                                    </Label>
                                    <Input
                                        id="listAgentName"
                                        name="listAgentName"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.listAgentName}
                                        onChange={handleInputChange}
                                        className="h-10"
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="listAgentEmail" className="text-sm font-semibold text-slate-700">
                                        Agent Email
                                    </Label>
                                    <Input
                                        id="listAgentEmail"
                                        name="listAgentEmail"
                                        type="email"
                                        placeholder="agent@example.com"
                                        value={formData.listAgentEmail}
                                        onChange={handleInputChange}
                                        className="h-10"
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="listOfficeName" className="text-sm font-semibold text-slate-700">
                                        Office Name
                                    </Label>
                                    <Input
                                        id="listOfficeName"
                                        name="listOfficeName"
                                        type="text"
                                        placeholder="NY Brokers"
                                        value={formData.listOfficeName}
                                        onChange={handleInputChange}
                                        className="h-10"
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="listOfficePhone" className="text-sm font-semibold text-slate-700">
                                        Office Phone
                                    </Label>
                                    <Input
                                        id="listOfficePhone"
                                        name="listOfficePhone"
                                        type="text"
                                        placeholder="555-0123"
                                        value={formData.listOfficePhone}
                                        onChange={handleInputChange}
                                        className="h-10"
                                        disabled
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11 text-base font-semibold rounded-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Property'
                            )}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.push('/agent/listings')}
                            variant="outline"
                            className="flex-1 h-11 text-base font-semibold rounded-lg border-slate-300"
                        >
                            Back to Properties
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
