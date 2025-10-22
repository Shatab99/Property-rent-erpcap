import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListIcon, MapPin, Sliders, SlidersHorizontal, Loader2, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/baseurl";

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

export default function SearchBar() {
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

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

  const search = () => {
    if (searchInput.trim() === "") return;
    router.push(`/listings?search=${searchInput}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    router.push(`/listings?search=${suggestion}`);
    setShowSuggestions(false);
  };
  const handlePropertyClick = (suggestion: string) => {
    setSearchInput(suggestion);
    router.push(`/property/${suggestion}`);
    setShowSuggestions(false);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      search();
      setShowSuggestions(false);
    }
  };

  return (
    <div className="w-full rounded-xl bg-white/95 shadow-lg ring-1 ring-black/5 p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
      <div className="flex-1 flex items-center gap-2 border rounded-md px-3 py-2 bg-white relative" ref={suggestionsRef}>
        <MapPin className="text-muted-foreground flex-shrink-0" size={18} />
        <div className="flex-1 relative">
          <Input
            placeholder="Search properties by location, title.."
            className="border-0 focus-visible:ring-0 px-0"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            onFocus={() => searchInput && setShowSuggestions(true)}
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && searchInput && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {suggestionsLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
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
                          onClick={() => handlePropertyClick(item.listingKey)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b text-sm"
                        >
                          <div className="font-medium">{item.title}</div>
                          {/* <div className="text-xs text-muted-foreground">{item.listingKey}</div> */}
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
      <div className="flex justify-center items-center gap-2">
        <Button onClick={search} className="px-6">Search</Button>
        <Link href={"/listings"} passHref>
          <Button variant="outline" className="gap-2 cursor-pointer">
            <ListIcon size={16} /> All listings
          </Button>
        </Link>
      </div>
    </div>
  );
}
