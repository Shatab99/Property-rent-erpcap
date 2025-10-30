"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, MapPin, Check, Menu, X, Grid3x3, Map } from "lucide-react";
import api from "@/lib/baseurl";
import { sanitizeSearchInput } from "@/lib/sanitizeSearchInput";

const PropertyMap = dynamic(() => import("@/components/site/PropertyMap"), {
  ssr: false,
});

type ViewMode = "map";

interface PropertyImage {
    id: string;
    listingKey: string;
    title: string;
    originalPrice: number;
    bedrooms: number | null;
    bathrooms: number | null;
    area: number | null;
    images: string[];
    address: string;
    city: string;
    mlsStatus?: string;
    latitude?: number,
    longitude?: number
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        meta: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            perPage: number;
        };
        data: PropertyImage[];
    };
}

interface SearchSuggestion {
    city?: {
        city: string;
        stateOrProvince: string;
    }[];
    county?: {
        county: string;
        stateOrProvince: string;
    }[];
    suggestedProperties?: {
        listingKey: string;
        title: string;
    }[];
}

interface MapMarkerData {
    id: string;
    listingKey: string;
    title: string;
    price: number;
    address: string;
    city: string;
    bedrooms: number | null;
    bathrooms: number | null;
    images: string[];
    coordinates: [number, number]; // [lat, lng]
}

function ListingsMapContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef(null);

    // Initialize state from URL params or defaults
    const [searchInput, setSearchInput] = useState<string>(searchParams?.get("search") || "");
    const [query, setQuery] = useState(searchParams?.get("search") || "");
    const [sort, setSort] = useState(searchParams?.get("sort") || "recommended");
    const [sortField, setSortField] = useState(searchParams?.get("sortField") || "createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">((searchParams?.get("sortOrder") as "asc" | "desc") || "asc");
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams?.get("page") || "1"));
    const [properties, setProperties] = useState<PropertyImage[]>([]);
    const [mapMarkers, setMapMarkers] = useState<MapMarkerData[]>([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 12,
    });
    const [suggestions, setSuggestions] = useState<SearchSuggestion | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [hidePendingContingent, setHidePendingContingent] = useState(searchParams?.get("mlsStatus") === "Active");
    const [propertyType, setPropertyType] = useState(searchParams?.get("propertyType") || "");
    const [propertySubtype, setPropertySubtype] = useState(searchParams?.get("propertySubtype") || "");
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]); // Center of USA

    const propertyTypeOptions = ["Residential", "Residential Lease", "Residential Income", "Commercial Sale", "Land"];
    const propertySubtypeOptions = ["Condominium", "Stock Cooperative", "Single Family Residence", "Duplex", "Apartment", "Multi Family", "Retail", "Business", "Warehouse", "Manufactured Home", "Mixed Use"];

    // Update URL when state changes
    const updateURL = (
        newQuery?: string,
        newSort?: string,
        newSortField?: string,
        newSortOrder?: string,
        newPage?: number,
        newPropertyType?: string,
        newPropertySubtype?: string
    ) => {
        const params = new URLSearchParams();
        if (newQuery || query) params.set("search", newQuery || query);
        if (newSort || sort) params.set("sort", newSort || sort);
        if (newSortField || sortField) params.set("sortField", newSortField || sortField);
        if (newSortOrder || sortOrder) params.set("sortOrder", newSortOrder || sortOrder);
        if (newPage || currentPage) params.set("page", (newPage || currentPage).toString());
        if (hidePendingContingent) params.set("mlsStatus", "Active");
        if (newPropertyType || propertyType) params.set("propertyType", newPropertyType || propertyType);
        if (newPropertySubtype || propertySubtype) params.set("propertySubtype", newPropertySubtype || propertySubtype);

        router.replace(`/listings-map-view?${params.toString()}`);
    };

    // Fetch search suggestions
    useEffect(() => {
        if (!searchInput.trim()) {
            setSuggestions(null);
            setShowSuggestions(false);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                setSuggestionsLoading(true);
                const response = await api.get<{ success: boolean; data: SearchSuggestion }>(
                    `/properties/serach-suggestions?q=${encodeURIComponent(searchInput)}`
                );

                if (response.data.success) {
                    setSuggestions(response.data.data);
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions(null);
            } finally {
                setSuggestionsLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchInput]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch properties from API and geocode them
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                params.set("limit", "12");
                params.set("page", currentPage.toString());
                params.set("search", query);
                params.set("sortBy", sortField);
                params.set("order", sortOrder);

                if (hidePendingContingent) {
                    params.set("mlsStatus", "Active");
                }

                if (propertyType) {
                    params.set("propertyType", propertyType);
                }

                if (propertySubtype) {
                    params.set("propertySubType", propertySubtype);
                }

                const apiUrl = `/properties/all-properties-map?${params.toString()}`;
                const response = await api.get<ApiResponse>(apiUrl);

                if (response.data.success) {
                    setProperties(response.data.data.data);
                    setMeta(response.data.data.meta);

                    // Map properties to markers, filtering out those without coordinates
                    const markers = response.data.data.data
                        .filter(property => property.latitude !== null && property.longitude !== null)
                        .map((property) => ({
                            id: property.id,
                            listingKey: property.listingKey,
                            title: property.title,
                            price: property.originalPrice,
                            address: property.address,
                            city: property.city,
                            bedrooms: property.bedrooms,
                            bathrooms: property.bathrooms,
                            images: property.images,
                            coordinates: [property.latitude, property.longitude] as [number, number],
                        }));

                    setMapMarkers(markers);

                    // Set map center to first property with valid coordinates
                    if (markers.length > 0) {
                        setMapCenter(markers[0].coordinates);
                    }
                }
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();

        const pollInterval = setInterval(() => {
            fetchProperties();
        }, 10 * 60 * 60 * 1000);

        return () => clearInterval(pollInterval);
    }, [query, currentPage, sortField, sortOrder, hidePendingContingent, propertyType, propertySubtype]);

    console.log(properties)

    // Handle search button click
    const handleSearch = () => {
        setQuery(sanitizeSearchInput(searchInput));
        setCurrentPage(1);
        updateURL(sanitizeSearchInput(searchInput), sort, sortField, sortOrder, 1, propertyType, propertySubtype);
    };

    const handleHidePendingContingent = () => {
        setHidePendingContingent((prev) => !prev);
        setCurrentPage(1);
        updateURL(query, sort, sortField, sortOrder, 1, propertyType, propertySubtype);
    };

    // Handle Enter key in search input
    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
            setShowSuggestions(false);
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: string) => {
        setSearchInput(suggestion);
        setQuery(suggestion);
        setCurrentPage(1);
        updateURL(suggestion, sort, sortField, sortOrder, 1, propertyType, propertySubtype);
        setShowSuggestions(false);
    };

    const findPropertyByListingKey = (listingKey: string) => {
        router.push(`/property/${listingKey}`);
    };

    // Handle sort change
    const handleSortChange = (value: string) => {
        setSort(value);
        setCurrentPage(1);

        let newSortField = sortField;
        let newSortOrder: "asc" | "desc" = sortOrder;

        switch (value) {
            case "price_asc":
                newSortField = "originalPrice";
                newSortOrder = "asc";
                break;
            case "price_desc":
                newSortField = "originalPrice";
                newSortOrder = "desc";
                break;
            case "recommended":
            default:
                newSortField = "createdAt";
                newSortOrder = "desc";
                break;
        }

        setSortField(newSortField);
        setSortOrder(newSortOrder);
        updateURL(query, value, newSortField, newSortOrder, 1, propertyType, propertySubtype);
    };

    // Check if any filters are active
    const hasActiveFilters = hidePendingContingent || propertyType || propertySubtype;

    // Handle reset filters
    const handleResetFilters = () => {
        setHidePendingContingent(false);
        setPropertyType("");
        setPropertySubtype("");
        setCurrentPage(1);

        const params = new URLSearchParams();
        params.set("search", query);
        params.set("sort", sort);
        params.set("sortField", sortField);
        params.set("sortOrder", sortOrder);
        params.set("page", "1");

        router.replace(`/listings-map-view?${params.toString()}`);
    };

    return (
        <div className="bg-white h-screen flex flex-col">
            {/* Search Bar Section */}
            <section className="border-b bg-gradient-to-b from-gray-50 to-white flex-shrink-0">
                <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    {/* Search Bar */}
                    <div className="flex gap-2 sm:gap-3 items-center w-full mb-4 sm:mb-6">
                        <div className="flex-1 flex gap-2 items-center relative">
                            <Search size={18} className="text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 relative" ref={suggestionsRef}>
                                <Input
                                    placeholder="Search properties by location, title..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyPress={handleSearchKeyPress}
                                    onFocus={() => searchInput && setShowSuggestions(true)}
                                    className="flex-1 h-10 sm:h-11 rounded-lg shadow-sm focus:shadow-md transition-shadow text-sm sm:text-base"
                                />

                                {/* Suggestions Dropdown */}
                                {showSuggestions && searchInput && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                        {suggestionsLoading ? (
                                            <div className="p-4 text-center text-sm text-muted-foreground">
                                                Loading suggestions...
                                            </div>
                                        ) : suggestions ? (
                                            <div>
                                                {/* Cities */}
                                                {suggestions.city && suggestions.city.length > 0 && (
                                                    <div>
                                                        <div className="px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-700 sticky top-0">
                                                            <MapPin size={14} className="inline mr-2" />
                                                            Cities
                                                        </div>
                                                        {suggestions.city.map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                onClick={() => handleSuggestionClick(`${item.city}, ${item.stateOrProvince}`)}
                                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm transition-colors"
                                                            >
                                                                {item.city}, {item.stateOrProvince}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Counties */}
                                                {suggestions.county && suggestions.county.length > 0 && (
                                                    <div>
                                                        <div className="px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-700 sticky top-0">
                                                            <MapPin size={14} className="inline mr-2" />
                                                            Counties
                                                        </div>
                                                        {suggestions.county.map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                onClick={() => handleSuggestionClick(`${item.county}, ${item.stateOrProvince}`)}
                                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm transition-colors"
                                                            >
                                                                {item.county}, {item.stateOrProvince}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Properties */}
                                                {suggestions.suggestedProperties && suggestions.suggestedProperties.length > 0 && (
                                                    <div>
                                                        <div className="px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-700 sticky top-0">
                                                            Properties
                                                        </div>
                                                        {suggestions.suggestedProperties.map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                onClick={() => handleSuggestionClick(item.title)}
                                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm transition-colors"
                                                            >
                                                                {item.title}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* No suggestions */}
                                                {!suggestions.city?.length && !suggestions.county?.length && !suggestions.suggestedProperties?.length && (
                                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                                        No suggestions found
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-sm text-muted-foreground">
                                                No suggestions found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button className="gap-2 h-10 sm:h-11 px-4 sm:px-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm sm:text-base" onClick={handleSearch}>
                            <Search size={18} /> <span className="hidden sm:inline">Search</span>
                        </Button>
                        <Button
                            onClick={() => {
                                const params = new URLSearchParams();
                                if (query) params.set("search", query);
                                params.set("sort", sort);
                                params.set("sortField", sortField);
                                params.set("sortOrder", sortOrder);
                                params.set("page", "1");
                                if (hidePendingContingent) params.set("mlsStatus", "Active");
                                if (propertyType) params.set("propertyType", propertyType);
                                if (propertySubtype) params.set("propertySubtype", propertySubtype);
                                router.push(`/listings?${params.toString()}`);
                            }}
                            variant="outline"
                            className="gap-2 h-10 sm:h-11 px-4 sm:px-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm sm:text-base"
                        >
                            <Grid3x3 size={18} /> <span className="hidden sm:inline">Grid View</span>
                        </Button>
                    </div>

                    {/* Filters Section */}
                    <div className="space-y-3 sm:space-y-4">
                        {/* Mobile Filter Toggle Button */}
                        <div className="sm:hidden flex items-center gap-2">
                            <Button
                                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                variant="outline"
                                className="gap-2 h-10 rounded-lg w-full text-sm"
                            >
                                <Menu size={16} />
                                <span>Filters & Sort</span>
                            </Button>
                        </div>

                        {/* Mobile Filter Menu with Animation */}
                        {isFilterMenuOpen && (
                            <div className="sm:hidden fixed inset-0 z-40 bg-black/50 animate-in fade-in duration-200"
                                onClick={() => setIsFilterMenuOpen(false)} />
                        )}

                        <div
                            className={`sm:hidden fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${isFilterMenuOpen ? "translate-x-0" : "-translate-x-full"
                                }`}
                        >
                            {/* Mobile Menu Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 sm:py-4 flex items-center justify-between">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters & Sort</h2>
                                <button
                                    onClick={() => setIsFilterMenuOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-gray-600" />
                                </button>
                            </div>

                            {/* Mobile Filter Content */}
                            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                                {/* MLS Status */}
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">MLS Status</label>
                                    <Button
                                        onClick={() => {
                                            handleHidePendingContingent();
                                            setIsFilterMenuOpen(false);
                                        }}
                                        variant={hidePendingContingent ? "default" : "outline"}
                                        className="gap-2 w-full h-10 rounded-lg transition-all text-sm"
                                    >
                                        {hidePendingContingent && <Check size={16} />}
                                        <span>Hide Pending / Contingent</span>
                                    </Button>
                                </div>

                                {/* Property Type */}
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Property Type</label>
                                    <Select
                                        value={propertyType}
                                        onValueChange={(value) => {
                                            setPropertyType(value);
                                            setCurrentPage(1);
                                            updateURL(query, sort, sortField, sortOrder, 1, value, propertySubtype);
                                        }}
                                    >
                                        <SelectTrigger className="w-full h-10 rounded-lg border-gray-300 text-sm">
                                            <SelectValue placeholder="Select property type" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg">
                                            {propertyTypeOptions.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Property Subtype */}
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Property Subtype</label>
                                    <Select
                                        value={propertySubtype}
                                        onValueChange={(value) => {
                                            setPropertySubtype(value);
                                            setCurrentPage(1);
                                            updateURL(query, sort, sortField, sortOrder, 1, propertyType, value);
                                        }}
                                    >
                                        <SelectTrigger className="w-full h-10 rounded-lg border-gray-300 text-sm">
                                            <SelectValue placeholder="Select property subtype" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg">
                                            {propertySubtypeOptions.map((subtype) => (
                                                <SelectItem key={subtype} value={subtype}>
                                                    {subtype}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Reset Filters Button */}
                                {hasActiveFilters && (
                                    <Button
                                        onClick={() => {
                                            handleResetFilters();
                                            setIsFilterMenuOpen(false);
                                        }}
                                        variant="destructive"
                                        className="gap-2 w-full h-10 rounded-lg text-sm"
                                    >
                                        <span>✕</span> Clear Filters
                                    </Button>
                                )}

                                {/* Divider */}
                                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Sort & View</label>
                                </div>

                                {/* Sort Dropdown */}
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Sort by</label>
                                    <Select value={sort} onValueChange={handleSortChange}>
                                        <SelectTrigger className="w-full h-10 rounded-lg border-gray-300 text-sm">
                                            <SelectValue placeholder="Select sort option" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg">
                                            <SelectItem value="recommended">Recommended</SelectItem>
                                            <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                            <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Close Button at Bottom */}
                                <Button
                                    onClick={() => setIsFilterMenuOpen(false)}
                                    className="w-full h-10 rounded-lg mt-4 sm:mt-6 bg-gray-900 hover:bg-gray-800 text-sm"
                                >
                                    Done
                                </Button>
                            </div>
                        </div>

                        {/* Desktop/Tablet Primary Filters Row */}
                        <div className="hidden sm:flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap items-start sm:items-center">
                            {/* Mls status */}
                            <div className="w-full sm:w-auto">
                                <Button
                                    onClick={handleHidePendingContingent}
                                    variant={hidePendingContingent ? "default" : "outline"}
                                    className="gap-2 w-full sm:w-auto h-10 rounded-lg transition-all text-sm"
                                >
                                    {hidePendingContingent && <Check size={16} />}
                                    <span>Hide Pending / Contingent</span>
                                </Button>
                            </div>

                            {/* Property Type Dropdown */}
                            <div className="w-full sm:w-auto">
                                <Select
                                    value={propertyType}
                                    onValueChange={(value) => {
                                        setPropertyType(value);
                                        setCurrentPage(1);
                                        updateURL(query, sort, sortField, sortOrder, 1, value, propertySubtype);
                                    }}
                                >
                                    <SelectTrigger className="w-full sm:w-56 h-10 rounded-lg border-gray-300 shadow-sm hover:shadow-md transition-shadow text-sm">
                                        <SelectValue placeholder="Property Type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg">
                                        {propertyTypeOptions.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Property Subtype Dropdown */}
                            <div className="w-full sm:w-auto">
                                <Select
                                    value={propertySubtype}
                                    onValueChange={(value) => {
                                        setPropertySubtype(value);
                                        setCurrentPage(1);
                                        updateURL(query, sort, sortField, sortOrder, 1, propertyType, value);
                                    }}
                                >
                                    <SelectTrigger className="w-full sm:w-56 h-10 rounded-lg border-gray-300 shadow-sm hover:shadow-md transition-shadow text-sm">
                                        <SelectValue placeholder="Property Subtype" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg">
                                        {propertySubtypeOptions.map((subtype) => (
                                            <SelectItem key={subtype} value={subtype}>
                                                {subtype}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Reset Filters Button */}
                            {hasActiveFilters && (
                                <div className="w-full sm:w-auto">
                                    <Button
                                        onClick={handleResetFilters}
                                        variant="destructive"
                                        className="gap-2 w-full sm:w-auto h-10 rounded-lg shadow-sm hover:shadow-md transition-all text-sm"
                                    >
                                        <span>✕</span> Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Desktop/Tablet Secondary Controls Row */}
                        <div className="hidden sm:flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap items-start sm:items-center pt-2 border-t border-gray-200">
                            {/* Sort Dropdown */}
                            <div className="w-full sm:w-auto">
                                <Select value={sort} onValueChange={handleSortChange}>
                                    <SelectTrigger className="w-full sm:w-48 h-10 rounded-lg border-gray-300 shadow-sm hover:shadow-md transition-shadow text-sm">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg">
                                        <SelectItem value="recommended">Recommended</SelectItem>
                                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="flex-1 relative overflow-hidden">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : mapMarkers.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                        <p className="text-muted-foreground">No properties found matching your search.</p>
                        <Button variant="outline" onClick={() => setQuery("")} className="mt-4">
                            Clear search
                        </Button>
                    </div>
                ) : (
                    <PropertyMap
                        markers={mapMarkers}
                        center={mapCenter}
                        onMarkerClick={findPropertyByListingKey}
                        loading={loading}
                    />
                )}
            </section>
        </div>
    );
}

// Fallback component shown while loading
function ListingsMapFallback() {
    return (
        <div className="bg-white h-screen flex flex-col">
            <section className="border-b">
                <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="h-10 sm:h-11 bg-gray-200 rounded animate-pulse w-full"></div>
                </div>
            </section>
            <section className="flex-1 bg-gray-100 animate-pulse"></section>
        </div>
    );
}

export default function MapViewListings() {
    return (
        <Suspense fallback={<ListingsMapFallback />}>
            <ListingsMapContent />
        </Suspense>
    );
}

