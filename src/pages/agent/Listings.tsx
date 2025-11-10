"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Eye, MapPin, Loader2, AlertCircle, DollarSign, Bed, Bath, Ruler } from "lucide-react";
import { getToken } from "@/lib/getToken";
import api from "@/lib/baseurl";
import { toastError, toastSuccess } from "@/lib/toast";

interface Property {
  id: string;
  listingKey: string;
  title: string;
  originalPrice: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  address: string;
  mlsStatus: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
    data: Property[];
  };
}

const STATUS_OPTIONS = ["Active", "Sold", "Hold", "Coming Soon", "Pending", "Canceled", "Withdrawn", "Rented"];

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 border-green-300";
    case "sold":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "hold":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "coming soon":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "pending":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "canceled":
      return "bg-red-100 text-red-800 border-red-300";
    case "withdrawn":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "rented":
      return "bg-indigo-100 text-indigo-800 border-indigo-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
};

export default function Listings() {
  const router = useRouter();
  const token = getToken();
  
  const [listings, setListings] = useState<Property[]>([]);
  const [filteredListings, setFilteredListings] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 9;

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await api.get("/agent/agent-properties", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        setListings(response.data.data.data);
        setTotalItems(response.data.data.meta.totalItems);
        setTotalPages(Math.ceil(response.data.data.meta.totalItems / itemsPerPage));
        setCurrentPage(response.data.data.meta.currentPage);
        applyFilters(response.data.data.data, "", "all");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to fetch listings";
      setError(errorMsg);
      toastError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (items: Property[], search: string, status: string) => {
    let filtered = items;

    if (search.trim()) {
      filtered = filtered.filter((listing) =>
        listing.title.toLowerCase().includes(search.toLowerCase()) ||
        listing.address.toLowerCase().includes(search.toLowerCase()) ||
        listing.listingKey.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((listing) =>
        listing.mlsStatus.toLowerCase() === status.toLowerCase()
      );
    }

    setFilteredListings(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(listings, value, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    applyFilters(listings, searchTerm, value);
  };

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    try {
      const response = await api.put(
        "/agent/change-property-status",
        {
          propertyId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        // Update the listing in the state
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === propertyId
              ? { ...listing, mlsStatus: newStatus }
              : listing
          )
        );

        toastSuccess(`Property status updated to ${newStatus}`);
        
        // Refetch listings after status change
        await fetchListings();
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to update property status";
      toastError(errorMsg);
    }
  };

  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalFilteredPages = Math.ceil(filteredListings.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Property Listings</h1>
            <p className="text-slate-600 mt-2">
              Manage and track all your property listings
            </p>
          </div>

          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            onClick={() => router.push("/agent/add-property")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Property
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Properties</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{totalItems}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Active Listings</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {listings.filter(l => l.mlsStatus.toLowerCase() === "active").length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Badge className="bg-green-500">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Sold Properties</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {listings.filter(l => l.mlsStatus.toLowerCase() === "sold").length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Badge className="bg-blue-500">Sold</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {listings.filter(l => l.mlsStatus.toLowerCase() === "pending").length}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Badge className="bg-orange-500">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, address, or listing key..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 h-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-slate-200 focus:border-blue-500 focus:ring-blue-500 h-10">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="bg-red-50 border border-red-200">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-slate-600">Loading properties...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredListings.length === 0 && (
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <Eye className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-medium">No properties found</p>
              <p className="text-slate-400 mt-2">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Add a new property to get started"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Properties Grid */}
        {!isLoading && filteredListings.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedListings.map((property) => (
                <Card key={property.id} className="bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Image Section */}
                  <div className="relative h-48 bg-slate-200 overflow-hidden group">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getStatusColor(property.mlsStatus)} border`}>
                        {property.mlsStatus}
                      </Badge>
                    </div>

                    {/* Price Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <div className="flex items-center text-white">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="text-xl font-bold">{property.originalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{property.title}</h3>
                      <div className="flex items-start gap-1 mt-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p className="line-clamp-2">{property.address}</p>
                      </div>
                    </div>

                    {/* Listing Key */}
                    <div className="bg-slate-50 p-2 rounded">
                      <p className="text-xs text-slate-600">Listing Key: <span className="font-mono font-semibold text-slate-900">{property.listingKey}</span></p>
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                        <Bed className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-slate-600 text-xs">Beds</p>
                          <p className="font-bold text-slate-900">{property.bedrooms}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                        <Bath className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-slate-600 text-xs">Baths</p>
                          <p className="font-bold text-slate-900">{property.bathrooms}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                        <Ruler className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-slate-600 text-xs">Sqft</p>
                          <p className="font-bold text-slate-900">{(property.area / 1000).toFixed(1)}k</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Select
                        value={property.mlsStatus}
                        onValueChange={(newStatus) => handleStatusChange(property.id, newStatus)}
                      >
                        <SelectTrigger className="w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500 h-10">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalFilteredPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2"
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalFilteredPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === totalFilteredPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalFilteredPages, prev + 1))}
                  className="px-4 py-2"
                >
                  Next
                </Button>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center text-slate-600 text-sm mt-6">
              Showing {paginatedListings.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredListings.length)} of {filteredListings.length} properties
            </div>
          </>
        )}
      </div>
    </div>
  );
}