import { Heart, MapPin, BedSingle, Bath, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Property } from "@/components/site/PropertyCard";
import Image from "next/image";
import { useState } from "react";

export default function PropertyRow({ property }: { property: Property }) {
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  // Get valid images (those that haven't failed to load)
  const validImages = (property.images || []).filter((_, i) => !imageError[i]);
  
  // Check if all images failed or no images available
  const allImagesFailed = property.images && property.images.length > 0 
    ? property.images.every((_, i) => imageError[i]) 
    : !property.image;

  // Get primary image (use first valid image from the filtered list)
  const primaryImage = validImages.length > 0 ? validImages[0] : null;

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };
  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row">
      <div className="relative sm:w-64 aspect-[4/3] overflow-hidden">
        {allImagesFailed ? (
          <img
            src="/no_img.jpg"
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : primaryImage ? (
          <Image
            width={400}
            height={300}
            src={primaryImage}
            alt={property.title}
            loading="lazy"
            decoding="async"
            onError={() => {
              // Find the index of this image in the original array and mark it as failed
              const originalIndex = property.images?.indexOf(primaryImage) ?? -1;
              if (originalIndex >= 0) {
                handleImageError(originalIndex);
              }
            }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <img
            src="/no_img.jpg"
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
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
          </h3>
          <div className="flex flex-col text-sm text-muted-foreground">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin size={14} /> {property.location}
            </div>
            <span className={`flex flex-col items-end text-md font-semibold ${property.mlsStatus === "Active" ? "text-green-600" : property.mlsStatus === "Hold" ? "text-orange-400" : "text-red-900"}`}>{property.mlsStatus}</span>
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
            <Link href={`/property/${property.listingKey}`}>View details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
