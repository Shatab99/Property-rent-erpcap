"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Loader2 } from 'lucide-react'
import api from '@/lib/baseurl'
import { toastError, toastSuccess } from '@/lib/toast'
import { getToken } from '@/lib/getToken'

interface AgentProfileData {
  officeName: string
  officeAddress: string
  officePhone: string
  website?: string
  licenseNumber: string
  experience?: string
  minBudget?: number
  maxBudget?: number
  otherLanguages: string[]
  aboutAgent: string
  specialties: string[]
}

export default function AgentProfile() {
  const [formData, setFormData] = useState<AgentProfileData>({
    officeName: '',
    officeAddress: '',
    officePhone: '',
    website: '',
    licenseNumber: '',
    experience: '',
    minBudget: undefined,
    maxBudget: undefined,
    otherLanguages: [],
    aboutAgent: '',
    specialties: [],
  })

  const [newLanguage, setNewLanguage] = useState('')
  const [newSpecialty, setNewSpecialty] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Preload agent profile data on component mount and when token changes
  useEffect(() => {
    const fetchAgentProfile = async () => {
      try {
        const currentToken = getToken()
        if (!currentToken) {
          setIsPageLoading(false)
          toastError('No authentication token found')
          return
        }

        setIsPageLoading(true)
        const response = await api.get('/agent/my-agent-profile', {
          headers: {
            "Authorization": `Bearer ${currentToken}`
          }
        })

        if (response.data.success && response.data.data) {
          const profileData = response.data.data
          setFormData({
            officeName: profileData.officeName || '',
            officeAddress: profileData.officeAddress || '',
            officePhone: profileData.officePhone || '',
            website: profileData.website || '',
            licenseNumber: profileData.licenseNumber || '',
            experience: profileData.experience || '',
            minBudget: profileData.minBudget || undefined,
            maxBudget: profileData.maxBudget || undefined,
            otherLanguages: profileData.otherLanguages || [],
            aboutAgent: profileData.aboutAgent || '',
            specialties: profileData.specialties || [],
          })
          toastSuccess('Profile loaded successfully')
        } else {
          throw new Error('No profile data found, please complete your profile.')
        }
      } catch (error) {
        toastError('No profile data found, please complete your profile.')
      } finally {
        setIsPageLoading(false)
      }
    }

    fetchAgentProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.otherLanguages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        otherLanguages: [...prev.otherLanguages, newLanguage.trim()]
      }))
      setNewLanguage('')
    }
  }

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      otherLanguages: prev.otherLanguages.filter(lang => lang !== language)
    }))
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }))
      setNewSpecialty('')
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const currentToken = getToken()
      if (!currentToken) {
        setErrorMessage('Authentication token not found. Please log in again.')
        setIsLoading(false)
        return
      }

      // Validate required fields
      if (!formData.officeName.trim() || !formData.officeAddress.trim() || !formData.officePhone.trim() || !formData.licenseNumber.trim() || !formData.aboutAgent.trim()) {
        setErrorMessage('Please fill in all required fields')
        setIsLoading(false)
        return
      }

      // Create clean JSON payload
      const payload = {
        officeName: formData.officeName.trim(),
        officeAddress: formData.officeAddress.trim(),
        officePhone: formData.officePhone.trim(),
        website: formData.website?.trim(),
        licenseNumber: formData.licenseNumber.trim(),
        experience: formData.experience?.trim(),
        minBudget: formData.minBudget,
        maxBudget: formData.maxBudget,
        otherLanguages: formData.otherLanguages,
        aboutAgent: formData.aboutAgent.trim(),
        specialties: formData.specialties
      }

      console.log('Payload:', JSON.stringify(payload, null, 2))

      const response = await api.put('/agent/update-agent-profile', payload, {
        headers: {
          "Authorization": `Bearer ${currentToken}`
        }
      })

      if (!response.data.success) {
        throw new Error('Failed to update profile')
      }

      setSuccessMessage('Profile updated successfully!')
      toastSuccess('Profile updated successfully!')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
      toastError(error instanceof Error ? error.message : 'An error occurred')
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Agent Profile</h1>
          <p className="text-slate-600 mt-2">Manage your professional information and specialties</p>
        </div>

        {/* Loading Skeleton */}
        {isPageLoading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardHeader className="border-b border-slate-200 bg-slate-50">
                  <div className="h-6 bg-slate-300 rounded w-1/3 animate-pulse"></div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                      <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Form Content - Hidden while loading */}
        {!isPageLoading && (
          <>
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
          {/* Office Information Section */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-xl text-blue-900">Office Information</CardTitle>
              <CardDescription>Your office details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Office Name */}
              <div className="space-y-2">
                <Label htmlFor="officeName" className="text-sm font-semibold text-slate-700">
                  Office Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="officeName"
                  name="officeName"
                  type="text"
                  placeholder="e.g., Sunrise Real Estate"
                  value={formData.officeName}
                  onChange={handleInputChange}
                  className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Office Address */}
              <div className="space-y-2">
                <Label htmlFor="officeAddress" className="text-sm font-semibold text-slate-700">
                  Office Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="officeAddress"
                  name="officeAddress"
                  type="text"
                  placeholder="e.g., 123 Main Street, City, State ZIP"
                  value={formData.officeAddress}
                  onChange={handleInputChange}
                  className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Office Phone */}
              <div className="space-y-2">
                <Label htmlFor="officePhone" className="text-sm font-semibold text-slate-700">
                  Office Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="officePhone"
                  name="officePhone"
                  type="tel"
                  placeholder="e.g., (555) 123-4567"
                  value={formData.officePhone}
                  onChange={handleInputChange}
                  className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-semibold text-slate-700">
                  Website <span className="text-slate-400 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="e.g., https://www.sunrisereal.com"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* License Number */}
              <div className="space-y-2">
                <Label htmlFor="licenseNumber" className="text-sm font-semibold text-slate-700">
                  License Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  placeholder="e.g., RE-123456"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-semibold text-slate-700">
                  Years of Experience <span className="text-slate-400 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="experience"
                  name="experience"
                  type="text"
                  placeholder="e.g., 10 years"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Budget Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minBudget" className="text-sm font-semibold text-slate-700">
                    Minimum Budget <span className="text-slate-400 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="minBudget"
                    name="minBudget"
                    type="number"
                    placeholder="e.g., 100000"
                    value={formData.minBudget || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      minBudget: e.target.value ? parseFloat(e.target.value) : undefined
                    }))}
                    className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500">Minimum property budget you work with</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxBudget" className="text-sm font-semibold text-slate-700">
                    Maximum Budget <span className="text-slate-400 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="maxBudget"
                    name="maxBudget"
                    type="number"
                    placeholder="e.g., 5000000"
                    value={formData.maxBudget || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      maxBudget: e.target.value ? parseFloat(e.target.value) : undefined
                    }))}
                    className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500">Maximum property budget you work with</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages Section */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-xl text-purple-900">Languages</CardTitle>
              <CardDescription>Add languages you speak</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., Spanish, French, Mandarin"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                  className="h-10 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                />
                <Button
                  type="button"
                  onClick={addLanguage}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.otherLanguages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.otherLanguages.map((language) => (
                    <Badge
                      key={language}
                      className="bg-purple-100 text-purple-800 cursor-pointer hover:bg-purple-200 flex items-center gap-1 py-1 px-2"
                      onClick={() => removeLanguage(language)}
                    >
                      {language}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Specialties Section */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-orange-50 to-amber-50">
              <CardTitle className="text-xl text-orange-900">Specialties</CardTitle>
              <CardDescription>Select your areas of expertise</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., Residential, Commercial, Luxury"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                  className="h-10 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                />
                <Button
                  type="button"
                  onClick={addSpecialty}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      className="bg-orange-100 text-orange-800 cursor-pointer hover:bg-orange-200 flex items-center gap-1 py-1 px-2"
                      onClick={() => removeSpecialty(specialty)}
                    >
                      {specialty}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* About Agent Section */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="text-xl text-green-900">About You</CardTitle>
              <CardDescription>Professional biography and background</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-2">
              <Label htmlFor="aboutAgent" className="text-sm font-semibold text-slate-700">
                Professional Bio <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="aboutAgent"
                name="aboutAgent"
                placeholder="Write a professional bio about yourself, your experience, and your approach to real estate..."
                value={formData.aboutAgent}
                onChange={handleInputChange}
                rows={5}
                className="border-slate-300 focus:border-green-500 focus:ring-green-500 resize-none"
              />
              <p className="text-xs text-slate-500">
                {formData.aboutAgent.length}/500 characters recommended
              </p>
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
                  Saving...
                </>
              ) : (
                'Save Profile'
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
          </>
        )}
      </div>
    </div>
  )
}
