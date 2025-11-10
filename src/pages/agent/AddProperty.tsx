"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Loader2, Upload } from 'lucide-react'
import api from '@/lib/baseurl'
import { toastError, toastSuccess } from '@/lib/toast'
import { sanitizeSearchInput } from '@/lib/sanitizeSearchInput'
import { useRouter } from 'next/navigation'
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

export default function AddProperty() {
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

    console.log(formData)

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

    const token = getToken()

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingProfile, setIsLoadingProfile] = useState(true)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const router = useRouter()

    // Fetch agent profile data on component mount
    useEffect(() => {
        const fetchAgentProfile = async () => {
            try {
                setIsLoadingProfile(true)
                const response = await api.get('/agent/my-agent-profile', {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (response.data.success && response.data.data) {
                    const agentData = response.data.data
                    setFormData(prev => ({
                        ...prev,
                        listAgentName: agentData.name || '',
                        listAgentEmail: agentData.email || '',
                        listAgentPhone: agentData.phone || '',
                        listOfficeName: agentData.officeName || '',
                        listOfficePhone: agentData.officePhone || '',
                    }))
                }
            } catch (error) {
                console.error('Failed to fetch agent profile:', error)
                toastError('Please update your agent profile before adding a property.')
                router.push('/agent/profile')
            } finally {
                setIsLoadingProfile(false)
            }
        }

        fetchAgentProfile()
    }, [])

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

    const addAmenity = () => {
        if (newFeature.amenities?.trim() && !formData.amenities.includes(newFeature.amenities.trim())) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, newFeature.amenities.trim()]
            }))
            setNewFeature(prev => ({ ...prev, amenities: '' }))
        }
    }

    const removeAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter(a => a !== amenity)
        }))
    }

    const addAppliance = () => {
        if (newFeature.appliances?.trim() && !formData.appliances.includes(newFeature.appliances.trim())) {
            setFormData(prev => ({
                ...prev,
                appliances: [...prev.appliances, newFeature.appliances.trim()]
            }))
            setNewFeature(prev => ({ ...prev, appliances: '' }))
        }
    }

    const removeAppliance = (appliance: string) => {
        setFormData(prev => ({
            ...prev,
            appliances: prev.appliances.filter(a => a !== appliance)
        }))
    }

    const addHeating = () => {
        if (newFeature.heating?.trim() && !formData.heating.includes(newFeature.heating.trim())) {
            setFormData(prev => ({
                ...prev,
                heating: [...prev.heating, newFeature.heating.trim()]
            }))
            setNewFeature(prev => ({ ...prev, heating: '' }))
        }
    }

    const removeHeating = (heating: string) => {
        setFormData(prev => ({
            ...prev,
            heating: prev.heating.filter(h => h !== heating)
        }))
    }

    const addCooling = () => {
        if (newFeature.cooling?.trim() && !formData.cooling.includes(newFeature.cooling.trim())) {
            setFormData(prev => ({
                ...prev,
                cooling: [...prev.cooling, newFeature.cooling.trim()]
            }))
            setNewFeature(prev => ({ ...prev, cooling: '' }))
        }
    }

    const removeCooling = (cooling: string) => {
        setFormData(prev => ({
            ...prev,
            cooling: prev.cooling.filter(c => c !== cooling)
        }))
    }

    const addParking = () => {
        if (newFeature.parking?.trim() && !formData.parking.includes(newFeature.parking.trim())) {
            setFormData(prev => ({
                ...prev,
                parking: [...prev.parking, newFeature.parking.trim()]
            }))
            setNewFeature(prev => ({ ...prev, parking: '' }))
        }
    }

    const removeParking = (parking: string) => {
        setFormData(prev => ({
            ...prev,
            parking: prev.parking.filter(p => p !== parking)
        }))
    }

    const addInteriorFeature = () => {
        if (newFeature.interiorFeatures?.trim() && !formData.interiorFeatures.includes(newFeature.interiorFeatures.trim())) {
            setFormData(prev => ({
                ...prev,
                interiorFeatures: [...prev.interiorFeatures, newFeature.interiorFeatures.trim()]
            }))
            setNewFeature(prev => ({ ...prev, interiorFeatures: '' }))
        }
    }

    const removeInteriorFeature = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            interiorFeatures: prev.interiorFeatures.filter(f => f !== feature)
        }))
    }

    const addExteriorFeature = () => {
        if (newFeature.exteriorFeatures?.trim() && !formData.exteriorFeatures.includes(newFeature.exteriorFeatures.trim())) {
            setFormData(prev => ({
                ...prev,
                exteriorFeatures: [...prev.exteriorFeatures, newFeature.exteriorFeatures.trim()]
            }))
            setNewFeature(prev => ({ ...prev, exteriorFeatures: '' }))
        }
    }

    const removeExteriorFeature = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            exteriorFeatures: prev.exteriorFeatures.filter(f => f !== feature)
        }))
    }

    const addCommunityFeature = () => {
        if (newFeature.communityFeatures?.trim() && !formData.communityFeatures.includes(newFeature.communityFeatures.trim())) {
            setFormData(prev => ({
                ...prev,
                communityFeatures: [...prev.communityFeatures, newFeature.communityFeatures.trim()]
            }))
            setNewFeature(prev => ({ ...prev, communityFeatures: '' }))
        }
    }

    const removeCommunityFeature = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            communityFeatures: prev.communityFeatures.filter(f => f !== feature)
        }))
    }

    // Generic feature handlers
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

            if (!formData.streetNumber || !formData.city || !formData.stateOrProvince || !formData.postalCode) {
                setErrorMessage('Please fill in all required location fields (Street Number, City, State, Postal Code)')
                setIsLoading(false)
                return
            }

            const form = new FormData()
            const bodyData: Record<string, any> = {
                title: formData.title.trim(),
                description: formData.description.trim(),
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
                photosCount: formData.images.length,
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

            // Append images as separate files
            formData.images.forEach((image: any, index: number) => {
                if (image instanceof File) {
                    form.append('images', image, image.name)
                }
            })

            // Append JSON body data
            form.append('bodyData', JSON.stringify(bodyData))

            console.log('✅ Form Data:', {
                bodyData,
                imageCount: formData.images.length,
                files: Array.from(form.keys()),
            })

            const response = await api.post('/agent/add-property', form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!response.data.success) {
                throw new Error('Failed to create property listing')
            }

            setSuccessMessage('Property listing created successfully!')
            toastSuccess('Property listing created successfully!')
            setFormData({
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
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
            toastError(error instanceof Error ? error.message : 'An error occurred')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Add New Property</h1>
                    <p className="text-slate-600 mt-2">Create a new property listing with detailed information</p>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                        ✓ {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        ✕ {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <CardTitle className="text-xl text-blue-900">Basic Information</CardTitle>
                            <CardDescription>Title, description, and property type</CardDescription>
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
                                    placeholder="e.g., Beautiful 3BHK Modern Apartment"
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
                                    rows={4}
                                    className="resize-none"
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
                                            <option key={type} value={type}>{type}</option>
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
                                        value={formData.propertySubType || ''}
                                        onChange={handleInputChange}
                                        className="w-full h-10 px-3 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Select Property Sub Type</option>
                                        {propertySubtypeOptions.map((subtype) => (
                                            <option key={subtype} value={subtype}>{subtype}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image Upload */}
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                            <CardTitle className="text-xl text-cyan-900">Property Images</CardTitle>
                            <CardDescription>Upload up to 8 images of the property</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="propertyImages" className="text-sm font-semibold text-slate-700">
                                    Upload Images <span className="text-slate-400 text-xs">(Max 8 images)</span>
                                </Label>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                                    <input
                                        id="propertyImages"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || [])
                                            if (files.length + formData.images.length > 8) {
                                                setErrorMessage('Maximum 8 images allowed')
                                                return
                                            }
                                            setFormData(prev => ({
                                                ...prev,
                                                images: [...prev.images, ...files] as any
                                            }))
                                        }}
                                        className="hidden"
                                    />
                                    <label htmlFor="propertyImages" className="cursor-pointer">
                                        <Upload className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                                        <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB each</p>
                                    </label>
                                </div>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="space-y-4">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Uploaded Images ({formData.images.length}/8)
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {formData.images.map((image: any, index: number) => (
                                            <div key={index} className="relative group">
                                                <div className="w-full aspect-square bg-slate-100 rounded-lg overflow-hidden">
                                                    {image instanceof File ? (
                                                        <img
                                                            src={URL.createObjectURL(image)}
                                                            alt={`Preview ${index}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={image}
                                                            alt={`Image ${index}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            images: prev.images.filter((_, i) => i !== index)
                                                        }))
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <p className="text-xs text-slate-500 mt-1 truncate">
                                                    {image instanceof File ? image.name : `Image ${index + 1}`}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
                            <CardTitle className="text-xl text-green-900">Pricing</CardTitle>
                            <CardDescription>Set pricing and financial details</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-sm font-semibold text-slate-700">
                                        Offer Price (if no offer then keep the same price as original price) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price || ''}
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
                                        placeholder="0.00"
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
                                        placeholder="0.00"
                                        value={formData.taxAmount || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="securityDeposit" className="text-sm font-semibold text-slate-700">
                                        Security Deposit <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="securityDeposit"
                                        name="securityDeposit"
                                        type="text"
                                        placeholder="e.g., 1 month rent"
                                        value={formData.securityDeposit}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    id="canRent"
                                    name="canRent"
                                    type="checkbox"
                                    checked={formData.canRent}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded border-slate-300"
                                />
                                <Label htmlFor="canRent" className="text-sm font-semibold text-slate-700 cursor-pointer">
                                    Available for Rent
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Physical Details */}
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
                            <CardTitle className="text-xl text-purple-900">Physical Details</CardTitle>
                            <CardDescription>Bedrooms, bathrooms, area, and structure information</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bedrooms" className="text-sm font-semibold text-slate-700">
                                        Bedrooms <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="bedrooms"
                                        name="bedrooms"
                                        type="number"
                                        placeholder="0"
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
                                        placeholder="0"
                                        value={formData.bathrooms || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bathroomsFull" className="text-sm font-semibold text-slate-700">
                                        Full Baths <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="bathroomsFull"
                                        name="bathroomsFull"
                                        type="number"
                                        placeholder="0"
                                        value={formData.bathroomsFull || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bathroomsHalf" className="text-sm font-semibold text-slate-700">
                                        Half Baths <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="bathroomsHalf"
                                        name="bathroomsHalf"
                                        type="number"
                                        placeholder="0"
                                        value={formData.bathroomsHalf || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="area" className="text-sm font-semibold text-slate-700">
                                        Area (sqft) <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="area"
                                        name="area"
                                        type="number"
                                        placeholder="0"
                                        value={formData.area || ''}
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
                                        placeholder="0"
                                        value={formData.lotSizeAcres || ''}
                                        onChange={handleInputChange}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="yearBuilt" className="text-sm font-semibold text-slate-700">
                                        Year Built <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="yearBuilt"
                                        name="yearBuilt"
                                        type="number"
                                        placeholder="2020"
                                        value={formData.yearBuilt || ''}
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
                                        placeholder="0"
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
                            <CardDescription>Address and geographic details</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-slate-700">
                                    Full Address <span className="text-slate-400 text-xs">(Auto-generated)</span>
                                </Label>
                                <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg">
                                    <p className="text-sm font-medium text-slate-700 min-h-[40px] flex items-center">
                                        {formData.address ? (
                                            <span className="text-orange-900 font-semibold">{formData.address}</span>
                                        ) : (
                                            <span className="text-slate-400 italic">Address will appear here as you fill in the location fields...</span>
                                        )}
                                    </p>
                                </div>
                                <p className="text-xs text-slate-500">
                                    📍 This field auto-generates from Street Number, City, State, and Postal Code
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        State/Province <span className="text-red-500">*</span>
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

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
                            <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-slate-200">
                                <CardTitle className="text-lg">Amenities</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Swimming Pool"
                                        value={newFeature.amenities || ''}
                                        onChange={(e) => handleFeatureChange('amenities', e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature('amenities')}
                                        className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('amenities')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {(formData.amenities as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.amenities as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 flex items-center gap-1 py-1 px-2"
                                                onClick={() => handleRemoveFeature('amenities', item)}
                                            >
                                                {item}
                                                <X className="w-3 h-3" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Appliances */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-slate-200">
                                <CardTitle className="text-lg">Appliances</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Dishwasher"
                                        value={newFeature.appliances || ''}
                                        onChange={(e) => handleFeatureChange('appliances', e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature('appliances')}
                                        className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('appliances')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {(formData.appliances as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.appliances as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 flex items-center gap-1 py-1 px-2"
                                                onClick={() => handleRemoveFeature('appliances', item)}
                                            >
                                                {item}
                                                <X className="w-3 h-3" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Heating */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-slate-200">
                                <CardTitle className="text-lg">Heating</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Central Heating"
                                        value={newFeature.heating || ''}
                                        onChange={(e) => handleFeatureChange('heating', e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature('heating')}
                                        className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('heating')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {(formData.heating as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.heating as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 flex items-center gap-1 py-1 px-2"
                                                onClick={() => handleRemoveFeature('heating', item)}
                                            >
                                                {item}
                                                <X className="w-3 h-3" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Cooling */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50 border-b border-slate-200">
                                <CardTitle className="text-lg">Cooling</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Central AC"
                                        value={newFeature.cooling || ''}
                                        onChange={(e) => handleFeatureChange('cooling', e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature('cooling')}
                                        className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('cooling')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {(formData.cooling as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.cooling as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 flex items-center gap-1 py-1 px-2"
                                                onClick={() => handleRemoveFeature('cooling', item)}
                                            >
                                                {item}
                                                <X className="w-3 h-3" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Parking */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                                <CardTitle className="text-lg">Parking</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Garage"
                                        value={newFeature.parking || ''}
                                        onChange={(e) => handleFeatureChange('parking', e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature('parking')}
                                        className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('parking')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {(formData.parking as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.parking as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 flex items-center gap-1 py-1 px-2"
                                                onClick={() => handleRemoveFeature('parking', item)}
                                            >
                                                {item}
                                                <X className="w-3 h-3" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Interior Features */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                                <CardTitle className="text-lg">Interior Features</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Hardwood Floors"
                                        value={newFeature.interiorFeatures || ''}
                                        onChange={(e) => handleFeatureChange('interiorFeatures', e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature('interiorFeatures')}
                                        className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('interiorFeatures')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {(formData.interiorFeatures as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.interiorFeatures as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 flex items-center gap-1 py-1 px-2"
                                                onClick={() => handleRemoveFeature('interiorFeatures', item)}
                                            >
                                                {item}
                                                <X className="w-3 h-3" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Exterior Features */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-lime-50 to-green-50 border-b border-slate-200">
                                <CardTitle className="text-lg">Exterior Features</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Patio"
                                        value={newFeature.exteriorFeatures || ''}
                                        onChange={(e) => handleFeatureChange('exteriorFeatures', e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature('exteriorFeatures')}
                                        className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('exteriorFeatures')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {(formData.exteriorFeatures as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.exteriorFeatures as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 flex items-center gap-1 py-1 px-2"
                                                onClick={() => handleRemoveFeature('exteriorFeatures', item)}
                                            >
                                                {item}
                                                <X className="w-3 h-3" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Community Features */}
                        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-teal-50 to-green-50 border-b border-slate-200">
                                <CardTitle className="text-lg">Community Features</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Gated Community"
                                        value={newFeature.communityFeatures || ''}
                                        onChange={(e) => handleFeatureChange('communityFeatures', e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature('communityFeatures')}
                                        className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleAddFeature('communityFeatures')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {(formData.communityFeatures as string[])?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.communityFeatures as string[]).map((item) => (
                                            <Badge
                                                key={item}
                                                className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 flex items-center gap-1 py-1 px-2"
                                                onClick={() => handleRemoveFeature('communityFeatures', item)}
                                            >
                                                {item}
                                                <X className="w-3 h-3" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* HOA & Community */}
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50">
                            <CardTitle className="text-xl text-violet-900">HOA & Community</CardTitle>
                            <CardDescription>Association fees and community details</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                                <div className="space-y-2">
                                    <Label htmlFor="associationFeeFrequency" className="text-sm font-semibold text-slate-700">
                                        Fee Frequency <span className="text-slate-400 text-xs">(Optional)</span>
                                    </Label>
                                    <select
                                        id="associationFeeFrequency"
                                        name="associationFeeFrequency"
                                        value={formData.associationFeeFrequency || ''}
                                        onChange={handleInputChange}
                                        className="w-full h-10 px-3 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Select Frequency</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                        <option value="Annually">Annually</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-3 pt-7">
                                    <input
                                        id="seniorCommunityYN"
                                        name="seniorCommunityYN"
                                        type="checkbox"
                                        checked={formData.seniorCommunityYN || false}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 rounded border-slate-300"
                                    />
                                    <Label htmlFor="seniorCommunityYN" className="text-sm font-semibold text-slate-700 cursor-pointer">
                                        Senior Community
                                    </Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Agent & Office Info */}
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                            <CardTitle className="text-xl text-emerald-900">Listing Agent & Office</CardTitle>
                            <CardDescription>Agent and office contact information (Auto-filled from your profile)</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {isLoadingProfile ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
                                            <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
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
                                            disabled
                                            className="h-10 bg-slate-50 text-slate-600 cursor-not-allowed"
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
                                            placeholder="john@example.com"
                                            value={formData.listAgentEmail}
                                            disabled
                                            className="h-10 bg-slate-50 text-slate-600 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="listAgentPhone" className="text-sm font-semibold text-slate-700">
                                            Agent Phone
                                        </Label>
                                        <Input
                                            id="listAgentPhone"
                                            name="listAgentPhone"
                                            type="tel"
                                            placeholder="(555) 123-4567"
                                            value={formData.listAgentPhone}
                                            disabled
                                            className="h-10 bg-slate-50 text-slate-600 cursor-not-allowed"
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
                                            placeholder="Real Estate Office"
                                            value={formData.listOfficeName}
                                            disabled
                                            className="h-10 bg-slate-50 text-slate-600 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="listOfficePhone" className="text-sm font-semibold text-slate-700">
                                            Office Phone
                                        </Label>
                                        <Input
                                            id="listOfficePhone"
                                            name="listOfficePhone"
                                            type="tel"
                                            placeholder="(555) 987-6543"
                                            value={formData.listOfficePhone}
                                            disabled
                                            className="h-10 bg-slate-50 text-slate-600 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="daysOnMarket" className="text-sm font-semibold text-slate-700">
                                            Days on Market <span className="text-slate-400 text-xs">(Optional)</span>
                                        </Label>
                                        <Input
                                            id="daysOnMarket"
                                            name="daysOnMarket"
                                            type="number"
                                            placeholder="0"
                                            value={formData.daysOnMarket || ''}
                                            onChange={handleInputChange}
                                            className="h-10"
                                        />
                                    </div>
                                </div>
                            )}
                            {!isLoadingProfile && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
                                    ✓ Your profile information has been pre-filled automatically
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11 text-base font-semibold rounded-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Property Listing'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-11 text-base font-semibold border-slate-300"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
