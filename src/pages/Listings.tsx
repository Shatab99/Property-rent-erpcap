"use client";

import { Suspense } from "react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyCard from "@/components/site/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, MapPin, Home, Check, Menu, X, Map } from "lucide-react";
import api from "@/lib/baseurl";

import { sanitizeSearchInput } from "@/lib/sanitizeSearchInput";

type ViewMode = "grid";

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
  county?: string;
  mlsStatus?: string;
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

function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Initialize state from URL params or defaults
  const [searchInput, setSearchInput] = useState<string>(searchParams?.get("search") || "");
  const [query, setQuery] = useState(searchParams?.get("search") || "");
  const [sort, setSort] = useState(searchParams?.get("sort") || "recommended");
  const [sortField, setSortField] = useState(searchParams?.get("sortField") || "createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">((searchParams?.get("sortOrder") as "asc" | "desc") || "asc");
  const [view, setView] = useState<ViewMode>((searchParams?.get("view") as ViewMode) || "grid");
  const [showMap, setShowMap] = useState(searchParams?.get("map") === "true");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams?.get("page") || "1"));
  const [properties, setProperties] = useState<PropertyImage[]>([]);
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

  const propertyTypeOptions = ["Residential", "Residential Lease", "Residential Income", "Commercial Sale", "Land"];
  const propertySubtypeOptions = ["Condominium", "Stock Cooperative", "Single Family Residence", "Duplex", "Apartment", "Multi Family", "Retail", "Business", "Warehouse", "Manufactured Home", "Mixed Use"];

  // Update URL when state changes
  const updateURL = (
    newQuery?: string,
    newSort?: string,
    newSortField?: string,
    newSortOrder?: string,
    newView?: ViewMode,
    newMap?: boolean,
    newPage?: number,
    newPropertyType?: string,
    newPropertySubtype?: string
  ) => {
    const params = new URLSearchParams();
    if (newQuery || query) params.set("search", newQuery || query);
    if (newSort || sort) params.set("sort", newSort || sort);
    if (newSortField || sortField) params.set("sortField", newSortField || sortField);
    if (newSortOrder || sortOrder) params.set("sortOrder", newSortOrder || sortOrder);
    if (newView || view) params.set("view", newView || view);
    if (newMap || showMap) params.set("map", (newMap ?? showMap).toString());
    if (newPage || currentPage) params.set("page", (newPage || currentPage).toString());
    if (hidePendingContingent) params.set("mlsStatus", "Active");
    if (newPropertyType || propertyType) params.set("propertyType", newPropertyType || propertyType);
    if (newPropertySubtype || propertySubtype) params.set("propertySubtype", newPropertySubtype || propertySubtype);

    router.replace(`/listings?${params.toString()}`);
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

  // Fetch properties from API
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

        const apiUrl = `/properties/all-properties?${params.toString()}`;
        const response = await api.get<ApiResponse>(apiUrl);

        if (response.data.success) {
          setProperties(response.data.data.data);
          setMeta(response.data.data.meta);
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

  // Handle search button click
  const handleSearch = () => {
    setQuery(sanitizeSearchInput(searchInput));
    setCurrentPage(1);
    updateURL(sanitizeSearchInput(searchInput), sort, sortField, sortOrder, view, showMap, 1, propertyType, propertySubtype);
  };

  const handleHidePendingContingent = () => {
    setHidePendingContingent((prev) => !prev);
    setCurrentPage(1);
    updateURL(query, sort, sortField, sortOrder, view, showMap, 1, propertyType, propertySubtype);
  }

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
    updateURL(suggestion, sort, sortField, sortOrder, view, showMap, 1, propertyType, propertySubtype);
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
    updateURL(query, value, newSortField, newSortOrder, view, showMap, 1, propertyType, propertySubtype);
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
    params.set("view", view);
    params.set("page", "1");

    router.replace(`/listings?${params.toString()}`);
  };

  const mapQuery = query || (properties[0]?.city ?? "United States");

  // Dummy sorted for backward compatibility - actual sorting done by API
  const sorted = properties;

  return (
    <div className="bg-white">
      {/* Search Bar Section */}
      <section className="border-b bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="flex gap-3 items-center w-full mb-6">
            <div className="flex-1 flex gap-2 items-center relative">
              <Search size={18} className="text-muted-foreground flex-shrink-0" />
              <div className="flex-1 relative" ref={suggestionsRef}>
                <Input
                  placeholder="Search properties by location, title..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  onFocus={() => searchInput && setShowSuggestions(true)}
                  className="flex-1 h-11 rounded-lg shadow-sm focus:shadow-md transition-shadow"
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
                              <Home size={14} className="inline mr-2" />
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
            <div className="flex items-center gap-2">
              <Button className="gap-2 h-11 px-6 rounded-lg shadow-sm hover:shadow-md transition-shadow" onClick={handleSearch}>
                <Search size={18} /> <span className="hidden sm:inline">Search</span>
              </Button>
              {/* Map View Button */}
              <div className="w-full sm:w-auto">
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
                    router.push(`/listings-map-view?${params.toString()}`);
                  }}
                  variant="outline"
                  className="gap-2 w-full sm:w-auto h-10 rounded-lg shadow-sm hover:shadow-md transition-all text-sm"
                >
                  <Map size={16} />
                  <span className="hidden sm:inline">Map View</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="space-y-4">
            {/* Mobile Filter Toggle Button */}
            <div className="sm:hidden flex items-center gap-2">
              <Button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                variant="outline"
                className="gap-2 h-10 rounded-lg w-full"
              >
                <Menu size={18} />
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
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filters & Sort</h2>
                <button
                  onClick={() => setIsFilterMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Mobile Filter Content */}
              <div className="p-4 space-y-4">
                {/* MLS Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">MLS Status</label>
                  <Button
                    onClick={() => {
                      handleHidePendingContingent();
                      setIsFilterMenuOpen(false);
                    }}
                    variant={hidePendingContingent ? "default" : "outline"}
                    className="gap-2 w-full h-10 rounded-lg transition-all"
                  >
                    {hidePendingContingent && <Check size={16} />}
                    <span>Hide Pending / Contingent</span>
                  </Button>
                </div>

                {/* Property Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Property Type</label>
                  <Select
                    value={propertyType}
                    onValueChange={(value) => {
                      setPropertyType(value);
                      setCurrentPage(1);
                      updateURL(query, sort, sortField, sortOrder, view, showMap, 1, value, propertySubtype);
                    }}
                  >
                    <SelectTrigger className="w-full h-10 rounded-lg border-gray-300">
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
                  <label className="text-sm font-medium text-gray-700">Property Subtype</label>
                  <Select
                    value={propertySubtype}
                    onValueChange={(value) => {
                      setPropertySubtype(value);
                      setCurrentPage(1);
                      updateURL(query, sort, sortField, sortOrder, view, showMap, 1, propertyType, value);
                    }}
                  >
                    <SelectTrigger className="w-full h-10 rounded-lg border-gray-300">
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
                    className="gap-2 w-full h-10 rounded-lg"
                  >
                    <span>✕</span> Clear Filters
                  </Button>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200 pt-4">
                  <label className="text-sm font-medium text-gray-700">Sort & View</label>
                </div>

                {/* Sort Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Sort by</label>
                  <Select value={sort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full h-10 rounded-lg border-gray-300">
                      <SelectValue placeholder="Select sort option" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">View</label>
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
                      router.push(`/listings-map-view?${params.toString()}`);
                      setIsFilterMenuOpen(false);
                    }}
                    variant="outline"
                    className="gap-2 w-full h-10 rounded-lg text-sm"
                  >
                    <Map size={16} />
                    Map View
                  </Button>
                </div>

                {/* Close Button at Bottom */}
                <Button
                  onClick={() => setIsFilterMenuOpen(false)}
                  className="w-full h-10 rounded-lg mt-6 bg-gray-900 hover:bg-gray-800"
                >
                  Done
                </Button>
              </div>
            </div>

            {/* Desktop/Tablet Primary Filters Row */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-3 flex-wrap items-start sm:items-center">
              {/* Mls status */}
              <div className="w-full sm:w-auto">
                <Button
                  onClick={handleHidePendingContingent}
                  variant={hidePendingContingent ? "default" : "outline"}
                  className="gap-2 w-full sm:w-auto h-10 rounded-lg transition-all"
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
                    updateURL(query, sort, sortField, sortOrder, view, showMap, 1, value, propertySubtype);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-56 h-10 rounded-lg border-gray-300 shadow-sm hover:shadow-md transition-shadow">
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
                    updateURL(query, sort, sortField, sortOrder, view, showMap, 1, propertyType, value);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-56 h-10 rounded-lg border-gray-300 shadow-sm hover:shadow-md transition-shadow">
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
                    className="gap-2 w-full sm:w-auto h-10 rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <span>✕</span> Clear Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Desktop/Tablet Secondary Controls Row */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-3 flex-wrap items-start sm:items-center pt-2 border-t border-gray-200">
              {/* Sort Dropdown */}
              <div className="w-full sm:w-auto">
                <Select value={sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-48 h-10 rounded-lg border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Results Counter - Responsive */}
              <div className="text-sm text-muted-foreground ml-auto pt-2 sm:pt-0">
                <span className="font-semibold text-gray-700">{meta.totalItems}</span> results
                {query && ` for "${query}"`}
              </div>
            </div>

            {/* Mobile Results Counter */}
            <div className="sm:hidden text-sm text-muted-foreground text-center">
              <span className="font-semibold text-gray-700">{meta.totalItems}</span> results
              {query && ` for "${query}"`}
            </div>
          </div>
        </div>
      </section>

      {/* Content layout */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Grid View Only */}
          <div>
            <div className="">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="col-span-full flex items-center justify-center py-16">
                    <Loader2 className="animate-spin text-primary" size={32} />
                  </div>
                ) : properties.length === 0 ? (
                  <div className="col-span-full text-center py-16 text-muted-foreground">
                    No properties found matching your search.
                    <div className="mt-4">
                      <Button variant="outline" onClick={() => setQuery("")}>
                        Clear search
                      </Button>
                    </div>
                  </div>
                ) : (
                  sorted.map((p) => (
                    <PropertyCard
                      key={p.id}
                      property={{
                        id: p.id,
                        title: p.title,
                        price: p.originalPrice,
                        beds: p.bedrooms ?? 0,
                        baths: p.bathrooms ?? 0,
                        sqft: p.area ?? 0,
                        image: p.images[0] ?? "",
                        location: p.county ?? "",
                        images: p.images,
                        city: p.city,
                        mlsStatus: p.mlsStatus,
                        listingKey: p.listingKey,
                      }}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {!loading && properties.length > 0 && (
                <div className="mt-8 flex items-center justify-center gap-1 flex-wrap">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => {
                      const newPage = currentPage - 1;
                      setCurrentPage(newPage);
                      updateURL(query, sort, sortField, sortOrder, view, showMap, newPage, propertyType, propertySubtype);
                    }}
                  >
                    Prev
                  </Button>

                  <div className="flex flex-wrap items-center gap-1">
                    {/* Generate page numbers to display */}
                    {(() => {
                      const pages = new Set<number>();
                      const range = 2; // Show 2 pages on each side of current page

                      // Always include first page
                      pages.add(1);

                      // Always include last page
                      if (meta.totalPages > 1) {
                        pages.add(meta.totalPages);
                      }

                      // Include current page and surrounding pages
                      const start = Math.max(1, currentPage - range);
                      const end = Math.min(meta.totalPages, currentPage + range);

                      for (let i = start; i <= end; i++) {
                        pages.add(i);
                      }

                      // Convert to sorted array
                      const pageArray = Array.from(pages).sort((a, b) => a - b);

                      return pageArray.map((pageNum, idx) => {
                        const nextPage = pageArray[idx + 1];
                        const showDots = nextPage && nextPage - pageNum > 1;

                        return (
                          <div key={pageNum} className="flex items-center gap-1">
                            <Button
                              variant={pageNum === currentPage ? "default" : "outline"}
                              onClick={() => {
                                setCurrentPage(pageNum);
                                updateURL(query, sort, sortField, sortOrder, view, showMap, pageNum, propertyType, propertySubtype);
                              }}
                              className="w-10 h-10 p-0"
                            >
                              {pageNum}
                            </Button>
                            {showDots && (
                              <span className="px-2 text-muted-foreground">...</span>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>

                  <Button
                    variant="outline"
                    disabled={currentPage === meta.totalPages}
                    onClick={() => {
                      const newPage = currentPage + 1;
                      setCurrentPage(newPage);
                      updateURL(query, sort, sortField, sortOrder, view, showMap, newPage, propertyType, propertySubtype);
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Fallback component shown while loading
function ListingsFallback() {
  return (
    <div className="bg-white">
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Listings() {
  return (
    <Suspense fallback={<ListingsFallback />}>
      <ListingsContent />
    </Suspense>
  );
}

