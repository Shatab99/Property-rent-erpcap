import { Heart, MapPin, BedSingle, Bath, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Property } from "@/components/site/PropertyCard";
import Image from "next/image";

export default function PropertyRow({ property }: { property: Property }) {
  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row">
      <div className="relative sm:w-64 aspect-[4/3] overflow-hidden">
        <Image
          width={400} height={300}
          src={property.image}
          alt={property.title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const el = e.currentTarget;
            if (el.dataset.fallback !== "1") {
              el.src = "/placeholder.svg";
              el.dataset.fallback = "1";
            }
          }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          aria-label="favorite"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow hover:bg-white"
        >
          <Heart size={18} />
        </button>
      </div>
      <div className="flex-1 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-semibold text-lg">
            ${""}
            {property.price.toLocaleString()}{" "}
            <span className="text-xs text-muted-foreground font-normal">
              /mo
            </span>
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={14} /> {property.location}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
          {property.title}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
          <Button asChild>
            <Link href={`/property/${property.id}`}>View details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
