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
import { Search, Loader2, MapPin, Check, Menu, X, Grid3x3, Map, Heart } from "lucide-react";
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

    // County coordinates mapping (complete reference)
    const allCountiesCoordinates = {
        "Westchester County": [41.122, -73.794],
        "Queens": [40.7282, -73.7949],
        "Suffolk County": [40.883, -72.844],
        "Nassau County": [40.73, -73.585],
        "Kings (Brooklyn)": [40.6782, -73.9442],
        "Orange County": [41.391, -74.311],
        "Putnam County": [41.425, -73.749],
        "Rockland County": [41.148, -73.983],
        "Bronx County": [40.8448, -73.8648],
        "Dutchess County": [41.723, -73.751],
        "Sullivan County": [41.713, -74.725],
        "New York (Manhattan)": [40.7831, -73.9712],
        "Richmond (Staten Island)": [40.5795, -74.1502],
        "Ulster County": [41.858, -74.311],
        "Columbia County": [42.25, -73.75],
        "Greene County": [42.295, -74.123],
    } as Record<string, [number, number]>;

    // Initialize state - reset all query params on initial load (map view starts fresh)
    const [searchInput, setSearchInput] = useState<string>("");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("recommended");
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [properties, setProperties] = useState<PropertyImage[]>([]);
    const [mapMarkers, setMapMarkers] = useState<MapMarkerData[]>([]);
    const [latlong, setLatlong] = useState<[]>([]);
    const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [apiCounties, setApiCounties] = useState<string[]>([]);
    const [countiesLoading, setCountiesLoading] = useState(true);
    console.log("lat long : ", latlong)
    const [loading, setLoading] = useState(false);

    // Filtered counties based on API response
    const counties = apiCounties.reduce((acc, countyName) => {
        if (allCountiesCoordinates[countyName]) {
            acc[countyName] = allCountiesCoordinates[countyName];
        }
        return acc;
    }, {} as Record<string, [number, number]>);
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
    const [mapCenter, setMapCenter] = useState<[number, number]>([41.41595533303718, -73.64273071289064]);
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(true);
    const [dragStartY, setDragStartY] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const bottomSheetRef = useRef<HTMLDivElement>(null);
    const [isDesktopPanelVisible, setIsDesktopPanelVisible] = useState(true);

    // Pagination state for "Load More" button
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadMoreInFlightRef = useRef(false);

    // Favorites state
    const [favorites, setFavorites] = useState<string[]>([]);
    const [favoritesLoading, setFavoritesLoading] = useState(false);
    const token = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null;

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

    // Clear query params on initial load
    useEffect(() => {
        if (isInitialLoad) {
            // Reset URL to clean state on map view entry
            router.replace('/listings-map-view');
            setIsInitialLoad(false);
        }
    }, []);

    // Fetch counties from API on mount
    useEffect(() => {
        const fetchCounties = async () => {
            try {
                setCountiesLoading(true);
                const response = await api.get<{
                    success: boolean;
                    message: string;
                    data: string[]
                }>('/properties/all-counties');

                if (response.data.success && Array.isArray(response.data.data)) {
                    setApiCounties(response.data.data);
                } else {
                    console.error("Failed to fetch counties:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching counties:", error);
                // Fallback to empty counties if API fails
                setApiCounties([]);
            } finally {
                setCountiesLoading(false);
            }
        };

        fetchCounties();
    }, []);

    // Fetch user favorites on mount
    useEffect(() => {
        if (!token) return;

        const fetchUserFavorites = async () => {
            try {
                setFavoritesLoading(true);
                const res = await api.get('/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFavorites(res.data.data.favorites || []);
            } catch (error) {
                console.error("Error fetching user favorites:", error);
            } finally {
                setFavoritesLoading(false);
            }
        };

        fetchUserFavorites();
    }, [token]);

    // Fetch properties from API and geocode them
    useEffect(() => {
        // Guard: Only fetch if a county is selected OR if any search/filter is active
        if (!selectedCounty && !query && !propertyType && !propertySubtype && !hidePendingContingent) {
            // On initial load, just show county circles - no API call
            setMapMarkers([]);
            setProperties([]);
            return;
        }

        const fetchProperties = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                params.set("limit", "25");
                params.set("page", currentPage.toString());
                params.set("search", query);
                params.set("sortBy", sortField);
                params.set("order", sortOrder);

                if (selectedCounty) {
                    params.set("county", selectedCounty);
                }

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

                    // Set map center to first property with valid coordinates or county center
                    if (markers.length > 0) {
                        setMapCenter(markers[0].coordinates);
                    } else if (selectedCounty && counties[selectedCounty]) {
                        setMapCenter(counties[selectedCounty]);
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
    }, [query, currentPage, sortField, sortOrder, hidePendingContingent, propertyType, propertySubtype, selectedCounty]);

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

    const handleFavorite = async (e: React.MouseEvent, propertyId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            if (favorites.includes(propertyId)) {
                // Remove from favorites
                await api.delete(`/users/favorite/${propertyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFavorites(favorites.filter(id => id !== propertyId));
            } else {
                // Add to favorites
                await api.post(`/users/favorite/${propertyId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFavorites([...favorites, propertyId]);
            }
        } catch (error) {
            console.error("Error updating favorite:", error);
        }
    };

    const handleMapClick = (lat: number, lng: number) => {
        setLatlong([lat, lng] as any);
    };

    const handleCountyClick = (countyName: string) => {
        setSelectedCounty(countyName);
        setCurrentPage(1);
        setQuery("");
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

    // Handle loading more properties
    const handleLoadMore = async () => {
        // Prevent duplicate requests
        if (loadMoreInFlightRef.current || isLoadingMore) return;

        // Check if there are more pages to load
        if (meta.currentPage >= meta.totalPages) return;

        loadMoreInFlightRef.current = true;
        setIsLoadingMore(true);

        try {
            const nextPage = meta.currentPage + 1;
            const params = new URLSearchParams();
            params.set("limit", "25");
            params.set("page", nextPage.toString());
            params.set("search", query);
            params.set("sortBy", sortField);
            params.set("order", sortOrder);

            if (selectedCounty) {
                params.set("county", selectedCounty);
            }

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

            if (response.data.success && response.data.data.data.length > 0) {
                // Append new properties to existing ones
                setProperties((prev) => [...prev, ...response.data.data.data]);

                // Append new markers to existing ones
                const newMarkers = response.data.data.data
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

                setMapMarkers((prev) => [...prev, ...newMarkers]);

                // Update pagination meta
                setMeta(response.data.data.meta);
            }
        } catch (error) {
            console.error("Error loading more properties:", error);
        } finally {
            loadMoreInFlightRef.current = false;
            setIsLoadingMore(false);
        }
    };

    // Handle bottom sheet drag
    const handleDragStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setDragStartY(e.touches[0].clientY);
        setDragOffset(0);
    };

    const handleDragMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const currentY = e.touches[0].clientY;
        const offset = currentY - dragStartY;
        setDragOffset(Math.max(0, offset));
    };

    const handleDragEnd = () => {
        // If dragged down more than 100px or more than 20% of the sheet, hide it
        const threshold = 100;
        if (dragOffset > threshold) {
            setIsBottomSheetVisible(false);
        }
        setDragOffset(0);
        setDragStartY(0);
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
                                                            <button
                                                                key={`city-${idx}`}
                                                                onClick={() => handleSuggestionClick(item.city)}
                                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b text-sm transition-colors"
                                                            >
                                                                <div className="font-medium">{item.city}</div>
                                                                <div className="text-xs text-muted-foreground">{item.stateOrProvince}</div>
                                                            </button>
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
                                                            <button
                                                                key={`county-${idx}`}
                                                                onClick={() => handleSuggestionClick(item.county)}
                                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b text-sm transition-colors"
                                                            >
                                                                <div className="font-medium">{item.county}</div>
                                                                <div className="text-xs text-muted-foreground">{item.stateOrProvince}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Properties */}
                                                {suggestions.suggestedProperties && suggestions.suggestedProperties.length > 0 && (
                                                    <div>
                                                        <div className="px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-700 sticky top-0">
                                                            <MapPin size={14} className="inline mr-2" />
                                                            Properties
                                                        </div>
                                                        {suggestions.suggestedProperties.map((item, idx) => (
                                                            <button
                                                                key={`property-${idx}`}
                                                                onClick={() => findPropertyByListingKey(item.listingKey)}
                                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b text-sm transition-colors"
                                                            >
                                                                <div className="font-medium">{item.title}</div>
                                                            </button>
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

            {/* Properties Count Section */}
            {selectedCounty && mapMarkers.length > 0 && (
                <div className="flex bg-blue-50 border-b px-4 sm:px-6 lg:px-8 py-3 sm:py-4 items-center justify-between">
                    <div className="mx-auto max-w-7xl">
                        <p className="text-sm sm:text-base font-medium text-gray-900">
                            Showing <span className="font-bold text-blue-600">{mapMarkers.length}</span>
                            {mapMarkers.length === 1 ? " property" : " properties"} in
                            <span className="font-bold text-blue-600"> {selectedCounty}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setIsDesktopPanelVisible(!isDesktopPanelVisible)}
                        className="hidden lg:block text-sm font-semibold cursor-pointer text-blue-600 hover:text-blue-700 hover:border-b-2 hover:border-blue-700 transition-colors px-3 py-1"
                    >
                        {isDesktopPanelVisible ? "Hide Property Card" : "Show Property Card"}
                    </button>
                </div>
            )}

            {/* Map Section */}
            <section className="flex-1 relative overflow-hidden flex">
                {/* Back to Blue Circles Button */}
                {(!loading && (selectedCounty || mapMarkers.length > 0)) && (
                    <button
                        onClick={() => {
                            setSelectedCounty(null);
                            setQuery("");
                            setSearchInput("");
                            setHidePendingContingent(false);
                            setPropertyType("");
                            setPropertySubtype("");
                            setCurrentPage(1);
                            router.push('/listings-map-view');
                        }}
                        className="absolute top-4 right-4 lg:top-1 z-20 text-blue-600 border border-blue-600/30 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 active:scale-95 backdrop-blur-md bg-white/20 hover:bg-white/30 shadow-lg hover:shadow-xl"
                    >
                        ← Back to Blue Circles
                    </button>
                )}

                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : !selectedCounty && mapMarkers.length === 0 ? (
                    // Show map with county circles on initial load
                    <PropertyMap
                        markers={mapMarkers}
                        center={mapCenter}
                        onMarkerClick={findPropertyByListingKey}
                        onMapClick={handleMapClick}
                        onCountyClick={handleCountyClick}
                        loading={loading}
                        counties={counties}
                        showCountyCircles={true}
                        isCountySelected={false}
                    />
                ) : selectedCounty && mapMarkers.length === 0 ? (
                    // No properties found for selected county
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                        <p className="text-muted-foreground">No properties found in this county.</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedCounty(null);
                                setQuery("");
                            }}
                            className="mt-4"
                        >
                            Back to Counties
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Map - Left Side */}
                        <div className="flex-1 min-w-0">
                            <PropertyMap
                                markers={mapMarkers}
                                center={mapCenter}
                                onMarkerClick={findPropertyByListingKey}
                                onMapClick={handleMapClick}
                                onCountyClick={handleCountyClick}
                                loading={loading}
                                counties={counties}
                                showCountyCircles={false}
                                isCountySelected={true}
                                selectedCountyCoordinates={selectedCounty ? (counties[selectedCounty] as [number, number]) : undefined}
                            />
                        </div>

                        {/* Properties Panel - Right Side */}
                        {isDesktopPanelVisible && (
                            <div className="hidden lg:flex lg:w-96 bg-white border-l flex-col overflow-hidden shadow-lg">
                                {/* Panel Header */}
                                <div className="flex-shrink-0 border-b px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {mapMarkers.length} {mapMarkers.length === 1 ? "Property" : "Properties"}
                                    </p>
                                    <button
                                        onClick={() => setIsDesktopPanelVisible(false)}
                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                    >
                                        <X size={18} className="text-gray-600" />
                                    </button>
                                </div>

                                {/* Properties List */}
                                <div className="flex-1 overflow-y-auto">
                                    <div className="p-3 space-y-3">
                                        {mapMarkers.map((property) => (
                                            <div
                                                key={property.id}
                                                onClick={() => findPropertyByListingKey(property.listingKey)}
                                                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:border-blue-400 relative"
                                            >
                                                {/* Property Image */}
                                                {property.images[0] && (
                                                    <div className="relative w-full h-32 bg-gray-100 overflow-hidden">
                                                        <img
                                                            src={property.images[0]}
                                                            alt={property.title}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                        />
                                                    </div>
                                                )}

                                                {/* Favorite Heart Button */}
                                                <button
                                                    onClick={(e) => handleFavorite(e, property.id)}
                                                    className="absolute right-2 bottom-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 hover:scale-110"
                                                >
                                                    <Heart
                                                        size={18}
                                                        fill={favorites?.includes(property.id) ? "#ef4444" : "none"}
                                                        color={favorites?.includes(property.id) ? "#ef4444" : "currentColor"}
                                                        className="transition-all duration-300"
                                                    />
                                                </button>

                                                {/* Property Info */}
                                                <div className="p-3">
                                                    <h3 className="font-semibold text-sm text-gray-900 truncate">
                                                        {property.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 truncate mt-1">
                                                        {property.address}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {property.city}
                                                    </p>

                                                    {/* Price */}
                                                    <p className="text-lg font-bold text-blue-600 mt-2">
                                                        ${property.price?.toLocaleString()}
                                                    </p>

                                                    {/* Specs */}
                                                    <div className="flex gap-2 mt-2 text-xs text-gray-600">
                                                        {property.bedrooms !== null && (
                                                            <span className="bg-gray-100 px-2 py-1 rounded">
                                                                {property.bedrooms} bed
                                                            </span>
                                                        )}
                                                        {property.bathrooms !== null && (
                                                            <span className="bg-gray-100 px-2 py-1 rounded">
                                                                {property.bathrooms} bath
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Load More Button - Desktop */}
                                    {meta.currentPage < meta.totalPages && (
                                        <div className="border-t p-3 bg-gray-50">
                                            <button
                                                onClick={handleLoadMore}
                                                disabled={isLoadingMore}
                                                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2"
                                            >
                                                {isLoadingMore ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        <span>Loading...</span>
                                                    </>
                                                ) : (
                                                    <span>Load More Properties</span>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mobile/Tablet Properties Panel - Bottom Sheet */}
                        {isBottomSheetVisible && (
                            <div
                                ref={bottomSheetRef}
                                onTouchStart={handleDragStart}
                                onTouchMove={handleDragMove}
                                onTouchEnd={handleDragEnd}
                                className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t rounded-t-2xl shadow-xl max-h-96 transition-transform duration-300 ease-out flex flex-col"
                                style={{
                                    transform: `translateY(${dragOffset}px)`,
                                }}
                            >
                                {/* Handle */}
                                <div className="flex justify-center pt-2 pb-3 cursor-grab active:cursor-grabbing touch-none flex-shrink-0">
                                    <div className="w-12 h-1 bg-gray-300 rounded-full" />
                                </div>

                                {/* Header */}
                                <div className="px-4 py-2 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between flex-shrink-0">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {mapMarkers.length} {mapMarkers.length === 1 ? "Property" : "Properties"}
                                    </p>
                                    <button
                                        onClick={() => setIsBottomSheetVisible(false)}
                                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <X size={18} className="text-gray-600" />
                                    </button>
                                </div>

                                {/* Properties Horizontal Scroll */}
                                <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0">
                                    <div className="flex gap-3 p-4 pb-6">
                                        {mapMarkers.map((property) => (
                                            <div
                                                key={property.id}
                                                onClick={() => findPropertyByListingKey(property.listingKey)}
                                                className="flex-shrink-0 w-48 bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:border-blue-400 relative"
                                            >
                                                {/* Property Image */}
                                                {property.images[0] && (
                                                    <div className="relative w-full h-32 bg-gray-100 overflow-hidden">
                                                        <img
                                                            src={property.images[0]}
                                                            alt={property.title}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                        />
                                                    </div>
                                                )}

                                                {/* Favorite Heart Button */}
                                                <button
                                                    onClick={(e) => handleFavorite(e, property.id)}
                                                    className="absolute right-2 bottom-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 hover:scale-110"
                                                >
                                                    <Heart
                                                        size={18}
                                                        fill={favorites?.includes(property.id) ? "#ef4444" : "none"}
                                                        color={favorites?.includes(property.id) ? "#ef4444" : "currentColor"}
                                                        className="transition-all duration-300"
                                                    />
                                                </button>

                                                {/* Property Info */}
                                                <div className="p-3">
                                                    <h3 className="font-semibold text-sm text-gray-900 truncate">
                                                        {property.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 truncate mt-1">
                                                        {property.address}
                                                    </p>

                                                    {/* Price */}
                                                    <p className="text-base font-bold text-blue-600 mt-2">
                                                        ${property.price?.toLocaleString()}
                                                    </p>

                                                    {/* Specs */}
                                                    <div className="flex gap-2 mt-2 text-xs text-gray-600">
                                                        {property.bedrooms !== null && (
                                                            <span className="bg-gray-100 px-2 py-1 rounded">
                                                                {property.bedrooms} bed
                                                            </span>
                                                        )}
                                                        {property.bathrooms !== null && (
                                                            <span className="bg-gray-100 px-2 py-1 rounded">
                                                                {property.bathrooms} bath
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Load More Button - Mobile - Always Visible at Bottom */}
                                {meta.currentPage < meta.totalPages && (
                                    <div className="border-t p-3 bg-gray-50 flex-shrink-0">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={isLoadingMore}
                                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2"
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    <span>Loading...</span>
                                                </>
                                            ) : (
                                                <span>Load More Properties</span>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Show Properties Button - when sheet is hidden */}
                        {!isBottomSheetVisible && mapMarkers.length > 0 && (
                            <button
                                onClick={() => setIsBottomSheetVisible(true)}
                                className="lg:hidden fixed inset-x-0 bottom-4 z-40 mx-auto w-fit px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                            >
                                ↑ View {mapMarkers.length} {mapMarkers.length === 1 ? "Property" : "Properties"}
                            </button>
                        )}
                    </>
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

