"use client";

import { useMemo, useState } from "react";
import PropertyCard, { type Property } from "@/components/site/PropertyCard";
import PropertyRow from "@/components/site/PropertyRow";
import FiltersPanel, { type Filters } from "@/components/site/FiltersPanel";
import { properties } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, LayoutGrid, List, Map } from "lucide-react";

const DEFAULT_FILTERS: Filters = {
  query: "",
  price: [500, 8000],
  minBeds: -1,
  pets: { cats: false, dogs: false },
  amenities: {},
};

type ViewMode = "grid" | "list";

export default function Listings() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState("recommended");
  const [view, setView] = useState<ViewMode>("grid");
  const [showMap, setShowMap] = useState(false);

  const filtered: Property[] = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return properties
      .filter(
        (p) =>
          (!query ||
            p.title.toLowerCase().includes(query) ||
            p.location.toLowerCase().includes(query)) &&
          p.price >= filters.price[0] &&
          p.price <= filters.price[1] &&
          (filters.minBeds < 0 || p.beds >= filters.minBeds) &&
          (!filters.pets.cats || p.pets?.cats) &&
          (!filters.pets.dogs || p.pets?.dogs) &&
          Object.entries(filters.amenities).every(
            ([a, v]) => !v || p.amenities?.includes(a),
          ),
      )
      .sort((a, b) => {
        switch (sort) {
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "sqft_desc":
            return (b.sqft || 0) - (a.sqft || 0);
          default:
            return 0;
        }
      });
  }, [filters, sort]);

  const mapQuery = filters.query || (filtered[0]?.location ?? "United States");

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="bg-white">
      {/* Toolbar */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 md:hidden">
                    <SlidersHorizontal size={16} /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Filters</h3>
                  <FiltersPanel
                    filters={filters}
                    setFilters={setFilters}
                    onApply={() => {}}
                    onReset={resetFilters}
                  />
                </SheetContent>
              </Sheet>
              <div className="hidden md:block w-72">
                <Input
                  placeholder="Search location"
                  value={filters.query}
                  onChange={(e) =>
                    setFilters({ ...filters, query: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="sqft_desc">
                    Size: Large to Small
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={view === "grid" ? "default" : "outline"}
                className="gap-2"
                onClick={() => setView("grid")}
              >
                <LayoutGrid size={16} /> Grid
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                className="gap-2"
                onClick={() => setView("list")}
              >
                <List size={16} /> List
              </Button>
              <Button
                variant={showMap ? "default" : "outline"}
                className="gap-2 hidden sm:inline-flex"
                onClick={() => setShowMap((v) => !v)}
              >
                <Map size={16} /> Map
              </Button>
            </div>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            {filtered.length} results
          </div>
        </div>
      </section>

      {/* Content layout */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-6 py-6">
          {/* Sidebar */}
          <aside className="hidden md:block md:col-span-3">
            <div className="rounded-xl border bg-white p-4 shadow-sm sticky top-24">
              <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                onApply={() => {}}
                onReset={resetFilters}
              />
            </div>
          </aside>

          {/* Results + optional map */}
          <div
            className={
              showMap
                ? "md:col-span-9 grid md:grid-cols-12 gap-6"
                : "md:col-span-9"
            }
          >
            <div className={showMap ? "md:col-span-7" : ""}>
              <div
                className={
                  view === "grid"
                    ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
                    : "grid gap-4"
                }
              >
                {filtered.length === 0 ? (
                  <div className="col-span-full text-center py-16 text-muted-foreground">
                    No results match your filters.
                    <div className="mt-4">
                      <Button variant="outline" onClick={resetFilters}>
                        Reset filters
                      </Button>
                    </div>
                  </div>
                ) : (
                  filtered.map((p) =>
                    view === "grid" ? (
                      <PropertyCard key={p.id} property={p} />
                    ) : (
                      <PropertyRow key={p.id} property={p} />
                    ),
                  )
                )}
              </div>
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

