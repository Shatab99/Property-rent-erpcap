import React from "react";
import { Heart, MapPin, BedSingle, Bath, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  images?: string[];
  pets?: { cats: boolean; dogs: boolean };
  amenities?: string[];
}

export default function PropertyCard({ property }: { property: Property }) {
  const hasAltImage = Boolean(property.images?.[1]);
  const onImgError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const el = e.currentTarget;
    if (el.dataset.fallback !== "1") {
      el.src = "/placeholder.svg";
      el.dataset.fallback = "1";
    }
  };
  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          decoding="async"
          onError={onImgError}
          className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105${hasAltImage ? " group-hover:opacity-0" : ""}`}
        />
        {hasAltImage && (
          <img
            src={property.images![1]}
            alt={property.title}
            loading="lazy"
            decoding="async"
            onError={onImgError}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
          />
        )}
        <button
          aria-label="favorite"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow hover:bg-white"
        >
          <Heart size={18} />
        </button>
        <div className="absolute left-3 bottom-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            {property.location}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="font-semibold text-lg">
            ${""}
            {property.price.toLocaleString()}
          </h3>
          <span className="text-xs text-muted-foreground">/mo</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
          {property.title}
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BedSingle size={16} />
            {property.beds} bd
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} />
            {property.baths} ba
          </div>
          <div className="flex items-center gap-1">
            <Ruler size={16} />
            {property.sqft.toLocaleString()} sqft
          </div>
        </div>
        <div className="mt-4">
          <Button asChild className="w-full">
            <Link href={`/property/${property.id}`}>View details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
