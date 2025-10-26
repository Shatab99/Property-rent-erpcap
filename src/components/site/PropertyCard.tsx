import React, { useState, useEffect } from "react";
import { Heart, MapPin, BedSingle, Bath, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/baseurl";
import { toastError, toastSuccess } from "@/lib/toast";

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
  mlsStatus?: string;
  listingKey?: string;
}

export default function PropertyCard({ property }: { property: Property }) {
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null;

  useEffect(() => {
    // Check if property is in favorites
    const checkFavorite = () => {
      try {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favorites.includes(property.id));
      } catch {
        setIsFavorite(false);
      }
    };
    checkFavorite();

    // Listen for favorites changes
    window.addEventListener("favorites-change", checkFavorite);
    return () => window.removeEventListener("favorites-change", checkFavorite);
  }, [property.id]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      if (token) {
        // API call if authenticated
        const res = await api.post(`/users/favorite/${property.id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setIsFavorite(!isFavorite);
          toastSuccess(isFavorite ? "Removed from favorites" : "Added to favorites");
          window.dispatchEvent(new Event("favorites-change"));
        }
      } else {
        // Local storage if not authenticated
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        if (isFavorite) {
          const updated = favorites.filter((id: string) => id !== property.id);
          localStorage.setItem("favorites", JSON.stringify(updated));
        } else {
          favorites.push(property.id);
          localStorage.setItem("favorites", JSON.stringify(favorites));
        }
        setIsFavorite(!isFavorite);
        toastSuccess(!isFavorite ? "Added to favorites" : "Removed from favorites");
        window.dispatchEvent(new Event("favorites-change"));
      }
    } catch (error: any) {
      toastError(error?.response?.data?.message || "Failed to update favorite");
    } finally {
      setLoading(false);
    }
  };

  // Get valid images (those that haven't failed to load)
  const validImages = (property.images || []).filter((_, i) => !imageError[i]);
  
  // Check if all images failed or no images available
  const allImagesFailed = property.images && property.images.length > 0 
    ? property.images.every((_, i) => imageError[i]) 
    : !property.image;

  // Get primary image (use first valid image from the filtered list)
  const primaryImage = validImages.length > 0 ? validImages[0] : null;
  
  // Get secondary/hover image (use second valid image from the filtered list)
  const secondaryImage = validImages.length > 1 ? validImages[1] : null;

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };
  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden">
        {allImagesFailed ? (
          <img
            src="/no_img.jpg"
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            {/* Primary Image */}
            {primaryImage ? (
              <Image
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
                className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105${secondaryImage ? " group-hover:opacity-0" : ""}`}
                width={400}
                height={300}
              />
            ) : (
              <img
                src="/no_img.jpg"
                alt={property.title}
                className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105${secondaryImage ? " group-hover:opacity-0" : ""}`}
              />
            )}

            {/* Secondary Image (Hover) */}
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt={property.title}
                loading="lazy"
                decoding="async"
                onError={() => {
                  // Find the index of this image in the original array and mark it as failed
                  const originalIndex = property.images?.indexOf(secondaryImage) ?? -1;
                  if (originalIndex >= 0) {
                    handleImageError(originalIndex);
                  }
                }}
                width={400}
                height={300}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
              />
            )}
          </>
        )}
        <button
          onClick={handleFavorite}
          disabled={loading}
          aria-label="favorite"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow hover:bg-white transition-all"
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} color={isFavorite ? "red" : "currentColor"} />
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
          <span className={`text-md font-semibold ${property.mlsStatus === "Active" ? "text-green-600" : property.mlsStatus === "Hold" ? "text-orange-400" : "text-red-900"}`}>{property.mlsStatus}</span>
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
            <Link href={`/property/${property.listingKey}`}>View details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
