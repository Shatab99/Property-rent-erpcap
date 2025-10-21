"use client";

import { Suspense } from "react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyCard from "@/components/site/PropertyCard";
import PropertyRow from "@/components/site/PropertyRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, Map, Search, Loader2, MapPin, Home } from "lucide-react";
import api from "@/lib/baseurl";

type ViewMode = "grid" | "list";

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
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState(searchParams?.get("search") || "");
  const [sort, setSort] = useState(searchParams?.get("sort") || "recommended");
  const [sortField, setSortField] = useState(searchParams?.get("sortField") || "createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">((searchParams?.get("sortOrder") as "asc" | "desc") || "desc");
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

  // Update URL when state changes
  const updateURL = (
    newQuery?: string,
    newSort?: string,
    newSortField?: string,
    newSortOrder?: string,
    newView?: ViewMode,
    newMap?: boolean,
    newPage?: number
  ) => {
    const params = new URLSearchParams();
    if (newQuery || query) params.set("search", newQuery || query);
    if (newSort || sort) params.set("sort", newSort || sort);
    if (newSortField || sortField) params.set("sortField", newSortField || sortField);
    if (newSortOrder || sortOrder) params.set("sortOrder", newSortOrder || sortOrder);
    if (newView || view) params.set("view", newView || view);
    if (newMap || showMap) params.set("map", (newMap ?? showMap).toString());
    if (newPage || currentPage) params.set("page", (newPage || currentPage).toString());

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
        const response = await api.get<ApiResponse>(
          `/properties/all-properties?limit=12&page=${currentPage}&search=${query}&sortBy=${sortField}&order=${sortOrder}`
        );

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
    }, 10 * 60 * 1000); 

    return () => clearInterval(pollInterval);
  }, [query, currentPage, sortField, sortOrder]);

  // Handle search button click
  const handleSearch = () => {
    setQuery(searchInput);
    setCurrentPage(1);
    updateURL(searchInput, sort, sortField, sortOrder, view, showMap, 1);
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
    updateURL(suggestion, sort, sortField, sortOrder, view, showMap, 1);
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
    updateURL(query, value, newSortField, newSortOrder, view, showMap, 1);
  };

  const mapQuery = query || (properties[0]?.city ?? "United States");

  // Dummy sorted for backward compatibility - actual sorting done by API
  const sorted = properties;

  return (
    <div className="bg-white">
      {/* Search Bar Section */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            {/* Search Bar */}
            <div className="flex gap-2 items-center flex-1 relative">
              <div className="flex-1 flex gap-2 items-center relative">
                <Search size={18} className="text-muted-foreground flex-shrink-0" />
                <div className="flex-1 relative" ref={suggestionsRef}>
                  <Input
                    placeholder="Search properties by location, title..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    onFocus={() => searchInput && setShowSuggestions(true)}
                    className="flex-1"
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
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b text-sm"
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
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b text-sm"
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
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b text-sm"
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
              <Button className="gap-2 inline-flex" onClick={handleSearch}>
                <Search size={16} /> <div className="hidden md:block">Search</div>
              </Button>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
              <div className="flex flex-wrap items-center gap-2">
                <Select value={sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  className="gap-2"
                  onClick={() => {
                    setView("grid");
                    updateURL(query, sort, sortField, sortOrder, "grid", showMap, currentPage);
                  }}
                >
                  <LayoutGrid size={16} /> Grid
                </Button>

                <Button
                  variant={view === "list" ? "default" : "outline"}
                  className="gap-2"
                  onClick={() => {
                    setView("list");
                    updateURL(query, sort, sortField, sortOrder, "list", showMap, currentPage);
                  }}
                >
                  <List size={16} /> List
                </Button>

                {/* <Button
                  variant={showMap ? "default" : "outline"}
                  className="gap-2 inline-flex"
                  onClick={() => {
                    setShowMap((v) => !v);
                    updateURL(query, sort, sortField, sortOrder, view, !showMap, currentPage);
                  }}
                >
                  <Map size={16} /> Map
                </Button> */}
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground text-center mb-2">
          {meta.totalItems} properties found
          {query && ` for "${query}"`}
        </div>
      </section>

      {/* Content layout */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Results + optional map */}
          <div
            className={
              showMap
                ? "grid md:grid-cols-12 gap-6"
                : ""
            }
          >
            <div className={showMap ? "md:col-span-7" : ""}>
              <div
                className={
                  view === "grid"
                    ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid gap-4"
                }
              >
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
                  sorted.map((p) =>
                    view === "grid" ? (
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
                          location: p.city,
                          images: p.images,
                          mlsStatus: p.mlsStatus,
                          listingKey: p.listingKey
                        }}
                      />
                    ) : (
                      <PropertyRow
                        key={p.id}
                        property={{
                          id: p.id,
                          title: p.title,
                          price: p.originalPrice,
                          beds: p.bedrooms ?? 0,
                          baths: p.bathrooms ?? 0,
                          sqft: p.area ?? 0,
                          image: p.images[0] ?? "",
                          location: p.city,
                          images: p.images,
                          mlsStatus: p.mlsStatus,
                          listingKey: p.listingKey
                        }}
                      />
                    )
                  )
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
                      updateURL(query, sort, sortField, sortOrder, view, showMap, newPage);
                    }}
                  >
                    Prev
                  </Button>

                  <div className="flex flex-wrap items-center gap-1">
                    {/* First page */}
                    <Button
                      variant={currentPage === 1 ? "default" : "outline"}
                      onClick={() => {
                        setCurrentPage(1);
                        updateURL(query, sort, sortField, sortOrder, view, showMap, 1);
                      }}
                      className="w-10 h-10 p-0"
                    >
                      1
                    </Button>

                    {/* Dots if there's gap */}
                    {currentPage > 4 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}

                    {/* Pages around current page */}
                    {Array.from({ length: 5 }).map((_, i) => {
                      const pageNum = Math.max(2, currentPage - 2) + i;
                      if (pageNum > meta.totalPages || pageNum === 1) {
                        return null;
                      }
                      if (pageNum <= currentPage - 2 && currentPage > 4) {
                        return null;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPage ? "default" : "outline"
                          }
                          onClick={() => {
                            setCurrentPage(pageNum);
                            updateURL(query, sort, sortField, sortOrder, view, showMap, pageNum);
                          }}
                          className="w-10 h-10 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}

                    {/* Dots if there's gap */}
                    {currentPage < meta.totalPages - 3 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}

                    {/* Last pages */}
                    {meta.totalPages > 1 && (
                      <>
                        {Array.from({
                          length: Math.min(2, meta.totalPages - 1),
                        }).map((_, i) => {
                          const pageNum = meta.totalPages - 1 + i;
                          if (pageNum <= 1 || pageNum <= currentPage + 2 || pageNum > meta.totalPages) {
                            return null;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={
                                pageNum === currentPage ? "default" : "outline"
                              }
                              onClick={() => {
                                setCurrentPage(pageNum);
                                updateURL(query, sort, sortField, sortOrder, view, showMap, pageNum);
                              }}
                              className="w-10 h-10 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        {meta.totalPages > 1 && currentPage !== meta.totalPages && (
                          <Button
                            variant={
                              currentPage === meta.totalPages
                                ? "default"
                                : "outline"
                            }
                            onClick={() => {
                              setCurrentPage(meta.totalPages);
                              updateURL(query, sort, sortField, sortOrder, view, showMap, meta.totalPages);
                            }}
                            className="w-10 h-10 p-0"
                          >
                            {meta.totalPages}
                          </Button>
                        )}
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    disabled={currentPage === meta.totalPages}
                    onClick={() => {
                      const newPage = currentPage + 1;
                      setCurrentPage(newPage);
                      updateURL(query, sort, sortField, sortOrder, view, showMap, newPage);
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
            {showMap && (
              <div className="md:col-span-5">
                <div className="sticky top-24 h-[70vh] overflow-hidden rounded-xl border">
                  <iframe
                    title="map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                    loading="lazy"
                    className="h-full w-full border-0"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}
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

