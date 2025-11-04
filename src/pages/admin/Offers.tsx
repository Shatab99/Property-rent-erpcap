"use client"

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Search, Loader } from 'lucide-react'
import api from '@/lib/baseurl'
import { toastError, toastSuccess } from '@/lib/toast'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'

interface OfferApplication {
    id: string
    email: string
    offerAmount: number
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN'
    appliedAt: string
}

const ITEMS_PER_PAGE = 10
const STATUS_OPTIONS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN']

export default function Offers() {
    const [offers, setOffers] = useState<OfferApplication[]>([])
    const [filteredOffers, setFilteredOffers] = useState<OfferApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [currentPage, setCurrentPage] = useState(1)
    const router = useRouter();

    const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null;

    // Fetch offers from API
    useEffect(() => {
        fetchOffers()
    }, [])

    const fetchOffers = async () => {
        try {
            setLoading(true)
            const response = await api.get('/admin/offer-applications', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success && Array.isArray(response.data.data)) {
                setOffers(response.data.data)
                setFilteredOffers(response.data.data)
            } else {
                setOffers([])
                setFilteredOffers([])
            }
        } catch (error: any) {
            toastError('❌ Failed to load offers')
            console.error('Error fetching offers:', error)
            setOffers([])
            setFilteredOffers([])
        } finally {
            setLoading(false)
        }
    }

    // Filter offers based on search and status
    useEffect(() => {
        let filtered = offers

        // Filter by status
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(offer => offer.status === statusFilter)
        }

        // Filter by search term (email or offer amount)
        if (searchTerm.trim()) {
            filtered = filtered.filter(offer =>
                offer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                offer.offerAmount.toString().includes(searchTerm)
            )
        }

        setFilteredOffers(filtered)
        setCurrentPage(1) // Reset to first page when filters change
    }, [searchTerm, statusFilter, offers])

    // Pagination calculations
    const totalPages = Math.ceil(filteredOffers.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedOffers = filteredOffers.slice(startIndex, endIndex)

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Offer Applications</h1>
                    <p className="text-muted-foreground">Manage and track all property offer applications</p>
                </div>

                {/* Filters Section */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search by email or amount..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Status Dropdown */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map(status => (
                                        <SelectItem key={status} value={status}>
                                            {status === 'ALL' ? 'All Statuses' : status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Results Info */}
                        <div className="text-sm text-muted-foreground">
                            Showing {paginatedOffers.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredOffers.length)} of {filteredOffers.length} results
                        </div>
                    </CardContent>
                </Card>

                {/* Table Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Applications List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader className="h-6 w-6 animate-spin text-primary" />
                                <span className="ml-2 text-muted-foreground">Loading offers...</span>
                            </div>
                        ) : paginatedOffers.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-lg">
                                    {filteredOffers.length === 0 && offers.length === 0
                                        ? 'No offer applications yet'
                                        : 'No offers match your filters'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                                                <th className="text-left py-3 px-4 font-semibold text-foreground">Offer Amount</th>
                                                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                                                <th className="text-left py-3 px-4 font-semibold text-foreground">Applied Date</th>
                                                <th className="text-center py-3 px-4 font-semibold text-foreground">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedOffers.map(offer => (
                                                <tr key={offer.id} className="border-b hover:bg-muted/50 transition-colors">
                                                    <td className="py-3 px-4 text-foreground">{offer.email}</td>
                                                    <td className="py-3 px-4 text-foreground font-medium">${offer.offerAmount.toLocaleString()}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(offer.status)}`}>
                                                            {offer.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-foreground text-sm">{offer.appliedAt}</td>
                                                    <td className="py-3 px-4 text-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.push(`/admin/offers/${offer.id}`)}
                                                            className="text-xs"
                                                        >
                                                            View
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                        <div className="text-sm text-muted-foreground">
                                            Page {currentPage} of {totalPages}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="gap-2"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </Button>

                                            {/* Page Numbers */}
                                            <div className="flex gap-1">
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    let pageNum
                                                    if (totalPages <= 5) {
                                                        pageNum = i + 1
                                                    } else if (currentPage <= 3) {
                                                        pageNum = i + 1
                                                    } else if (currentPage >= totalPages - 2) {
                                                        pageNum = totalPages - 4 + i
                                                    } else {
                                                        pageNum = currentPage - 2 + i
                                                    }

                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={currentPage === pageNum ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className="min-w-10"
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    )
                                                })}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                className="gap-2"
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
