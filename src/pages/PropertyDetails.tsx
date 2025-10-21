"use client";
import Link from "next/link";
import {
    BedSingle,
    Bath,
    Ruler,
    MapPin,
    ShieldCheck,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import api from "@/lib/baseurl";
import { Loader2 } from "lucide-react";

interface PropertyData {
    id: string;
    listingKey: string;
    title: string;
    description: string;
    propertyType: string;
    propertySubType: string;
    price: number;
    originalPrice: number;
    bedrooms: number;
    bathrooms: number;
    bathroomsFull: number;
    bathroomsHalf: number | null;
    area: number | null;
    lotSizeAcres: number;
    lotSizeSquareFeet: number;
    yearBuilt: number;
    address: string;
    city: string;
    stateOrProvince: string;
    postalCode: string;
    county: string;
    images: string[];
    photosCount: number;
    interiorFeatures: string[];
    exteriorFeatures: string[];
    heating: string[];
    cooling: string[];
    daysOnMarket: number;
    listAgentName: string;
    listAgentEmail: string;
    listAgentPhone: string;
    listOfficeName: string;
    isVerified: boolean;
    mlsStatus: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: PropertyData;
}

export default function PropertyDetails({ id }: { id: string }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
    const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>({});
    const [property, setProperty] = useState<PropertyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const response = await api.get<ApiResponse>(`/properties/${id}`);
                if (response.data.success) {
                    setProperty(response.data.data);
                    setError(null);
                }
            } catch (err) {
                console.error("Error fetching property:", err);
                setError("Failed to load property details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary mx-auto mb-4" size={40} />
                    <p className="text-muted-foreground">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="bg-white">
                <section className="py-16">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-2xl font-bold">Property not found</h1>
                        <p className="mt-2 text-muted-foreground">
                            {error || "The property you are looking for does not exist."}
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/listings">Back to listings</Link>
                        </Button>
                    </div>
                </section>
            </div>
        );
    }

    const handleImageError = (index: number) => {
        setImageError((prev) => ({ ...prev, [index]: true }));
    };

    const handleImageLoad = (index: number) => {
        setImagesLoaded((prev) => ({ ...prev, [index]: true }));
    };

    // Get the next valid (non-failed) image index
    const getNextValidImageIndex = (currentIndex: number, direction: 'next' | 'prev'): number => {
        const validImages = property.images.map((_, i) => i).filter(i => !imageError[i]);

        if (validImages.length === 0) return 0; // All failed, show fallback

        const currentValidIndex = validImages.indexOf(currentIndex);
        if (currentValidIndex === -1) {
            // Current index is invalid, find the next valid one
            return direction === 'next' ? validImages[0] : validImages[validImages.length - 1];
        }

        if (direction === 'next') {
            const nextIndex = currentValidIndex + 1;
            return validImages[nextIndex >= validImages.length ? 0 : nextIndex];
        } else {
            const prevIndex = currentValidIndex - 1;
            return validImages[prevIndex < 0 ? validImages.length - 1 : prevIndex];
        }
    };

    const handlePrevImage = () => {
        setActiveImageIndex(getNextValidImageIndex(activeImageIndex, 'prev'));
    };

    const handleNextImage = () => {
        setActiveImageIndex(getNextValidImageIndex(activeImageIndex, 'next'));
    };

    // Check if all images have failed
    const allImagesFailed = property.images.every((_, i) => imageError[i]);

    // Get valid images for thumbnail carousel
    const validImages = property.images.map((src, i) => ({ src, index: i }))
        .filter(({ index }) => !imageError[index]);

    // Check if active/carousel images are loaded
    const isCarouselImageLoaded = allImagesFailed || imagesLoaded[activeImageIndex];
    const allValidImagesLoaded = validImages.length > 0 ? validImages.every(({ index }) => imagesLoaded[index]) : true;

    // Check if we have any valid images at all
    const hasValidImages = validImages.length > 0;

    const mapQuery = encodeURIComponent(`${property.address}, ${property.city}`);
    const fullAddress = `${property.address}, ${property.city}, ${property.stateOrProvince} ${property.postalCode}`;

    return (
        <div className="bg-white">
            {/* Title + Meta */}
            <section className="border-b">
                <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                                {property.title}
                            </h1>
                            <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                    <MapPin size={14} /> {property.city}, {property.stateOrProvince}
                                </span>
                                <span className={`inline-flex items-center gap-1 ${property.mlsStatus === "Active" ? "text-green-600" :
                                    property.mlsStatus === "Hold" ? "text-orange-400" : "text-red-600"}`}>
                                    <ShieldCheck size={14} /> {property.mlsStatus}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                                ${property.price.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-4 sm:py-6 md:py-8">
                <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 grid gap-6 sm:gap-8 lg:grid-cols-3">
                    {/* Left - gallery and details */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        {/* Gallery with Carousel */}
                        <div className="overflow-hidden rounded-lg sm:rounded-xl border bg-white shadow-sm">
                            {/* Desktop Carousel - Hidden on Mobile */}
                            <div className="hidden lg:block">
                                {/* Main Image Display */}
                                <div className="relative w-full h-48 sm:h-64 md:h-96 lg:aspect-video overflow-hidden bg-gray-100">
                                    {/* Loading Skeleton - only show if image is actually loading */}
                                    {!allImagesFailed && !imagesLoaded[activeImageIndex] && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse z-5" />
                                    )}

                                    {allImagesFailed ? (
                                        <img
                                            src="/no_img.jpg"
                                            alt="No image available"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : !imageError[activeImageIndex] ? (
                                        <Image
                                            src={property.images[activeImageIndex]}
                                            alt={`${property.title} ${activeImageIndex + 1}`}
                                            fill
                                            className="object-cover"
                                            onError={() => handleImageError(activeImageIndex)}
                                            onLoad={() => handleImageLoad(activeImageIndex)}
                                            priority
                                        />
                                    ) : (
                                        // If current image failed but others exist, auto-switch to next valid
                                        <Image
                                            src={property.images[getNextValidImageIndex(activeImageIndex, 'next')]}
                                            alt={`${property.title}`}
                                            fill
                                            className="object-cover"
                                            onError={() => handleImageError(getNextValidImageIndex(activeImageIndex, 'next'))}
                                            onLoad={() => handleImageLoad(getNextValidImageIndex(activeImageIndex, 'next'))}
                                            priority
                                        />
                                    )}

                                    {/* Navigation Arrows */}
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-md transition-all z-10"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-md transition-all z-10"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                                    </button>

                                    {/* Image Counter */}
                                    <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/60 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                        {allImagesFailed ? "No images" : `${activeImageIndex + 1} / ${property.images.length}`}
                                    </div>
                                </div>

                                {/* Thumbnail Carousel */}
                                <div className="p-2 sm:p-4 bg-gray-50 border-t overflow-x-auto">
                                    <div className="flex gap-2 pb-2">
                                        {allImagesFailed ? (
                                            <div className="text-center text-xs sm:text-sm text-muted-foreground w-full py-2">
                                                No images available
                                            </div>
                                        ) : (
                                            validImages.map(({ src, index }) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveImageIndex(index)}
                                                    className={`flex-shrink-0 relative aspect-[4/3] w-16 sm:w-20 md:w-24 overflow-hidden rounded-lg ring-2 transition-all ${activeImageIndex === index
                                                        ? "ring-primary"
                                                        : "ring-gray-200 hover:ring-gray-300"
                                                        }`}
                                                >
                                                    {!imagesLoaded[index] && (
                                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse z-5" />
                                                    )}
                                                    <Image
                                                        src={src}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        onError={() => handleImageError(index)}
                                                        onLoad={() => handleImageLoad(index)}
                                                    />
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Carousel - Visible only on Mobile */}
                            <div className="lg:hidden">
                                {/* Mobile Full-Screen Carousel */}
                                <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                                    {/* Loading Skeleton - only show if image is actually loading (not loaded yet) */}
                                    {!allImagesFailed && !imagesLoaded[activeImageIndex] && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse z-5" />
                                    )}

                                    {allImagesFailed ? (
                                        <img
                                            src="/no_img.jpg"
                                            alt="No image available"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : !imageError[activeImageIndex] ? (
                                        <Image
                                            src={property.images[activeImageIndex]}
                                            alt={`${property.title} ${activeImageIndex + 1}`}
                                            fill
                                            className="object-cover"
                                            onError={() => handleImageError(activeImageIndex)}
                                            onLoad={() => handleImageLoad(activeImageIndex)}
                                            priority
                                        />
                                    ) : (
                                        <Image
                                            src={property.images[getNextValidImageIndex(activeImageIndex, 'next')]}
                                            alt={`${property.title}`}
                                            fill
                                            className="object-cover"
                                            onError={() => handleImageError(getNextValidImageIndex(activeImageIndex, 'next'))}
                                            onLoad={() => handleImageLoad(getNextValidImageIndex(activeImageIndex, 'next'))}
                                            priority
                                        />
                                    )}

                                    {/* Mobile Navigation - Larger touch targets */}
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md transition-all z-10"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md transition-all z-10"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={24} />
                                    </button>

                                    {/* Mobile Image Counter */}
                                    <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
                                        {allImagesFailed ? "No images" : `${activeImageIndex + 1} / ${property.images.length}`}
                                    </div>
                                </div>

                                {/* Mobile Dot Indicators */}
                                <div className="bg-gray-50 border-t p-3 flex justify-center gap-1.5">
                                    {allImagesFailed ? (
                                        <div className="text-xs text-muted-foreground">No images available</div>
                                    ) : (
                                        property.images.map((_, index) => (
                                            !imageError[index] && (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveImageIndex(index)}
                                                    className={`h-2 rounded-full transition-all ${
                                                        activeImageIndex === index
                                                            ? "w-6 bg-primary"
                                                            : "w-2 bg-gray-300 hover:bg-gray-400"
                                                    }`}
                                                    aria-label={`Go to image ${index + 1}`}
                                                />
                                            )
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Specs */}
                        <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 rounded-xl border bg-white p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <BedSingle className="text-foreground flex-shrink-0" size={16} />
                                <span className="text-foreground font-medium">
                                    {property.bedrooms}
                                </span>{" "}
                                <span className="hidden sm:inline">Beds</span>
                                <span className="sm:hidden">Bd</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Bath className="text-foreground flex-shrink-0" size={16} />
                                <span className="text-foreground font-medium">
                                    {property.bathrooms}
                                </span>{" "}
                                <span className="hidden sm:inline">Baths</span>
                                <span className="sm:hidden">Ba</span>
                            </div>
                            {property.lotSizeSquareFeet && (
                                <div className="flex items-center gap-2">
                                    <Ruler className="text-foreground flex-shrink-0" size={16} />
                                    <span className="text-foreground font-medium">
                                        {(property.lotSizeSquareFeet / 1000).toFixed(1)}k
                                    </span>{" "}
                                    <span className="hidden sm:inline">Sq Ft</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mt-4 sm:mt-6">
                            <h2 className="text-lg sm:text-xl font-semibold">Description</h2>
                            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {property.description}
                            </p>
                        </div>

                        {/* Interior Features */}
                        {property.interiorFeatures.length > 0 && (
                            <div className="mt-4 sm:mt-6">
                                <h2 className="text-lg sm:text-xl font-semibold">Interior Features</h2>
                                <ul className="mt-2 sm:mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground">
                                    {property.interiorFeatures.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Exterior Features */}
                        {property.exteriorFeatures.length > 0 && (
                            <div className="mt-4 sm:mt-6">
                                <h2 className="text-lg sm:text-xl font-semibold">Exterior Features</h2>
                                <ul className="mt-2 sm:mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground">
                                    {property.exteriorFeatures.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Heating & Cooling */}
                        <div className="mt-6 grid md:grid-cols-2 gap-6">
                            {property.heating.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold">Heating</h2>
                                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                                        {property.heating.map((item) => (
                                            <li key={item} className="flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {property.cooling.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold">Cooling</h2>
                                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                                        {property.cooling.map((item) => (
                                            <li key={item} className="flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Map */}
                        <div className="mt-6">
                            <h2 className="text-lg sm:text-xl font-semibold">Location</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{fullAddress}</p>
                            <div className="mt-3 overflow-hidden rounded-lg sm:rounded-xl border h-48 sm:h-64 md:h-72">
                                <iframe
                                    title="map"
                                    src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                                    loading="lazy"
                                    className="h-full w-full border-0"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right - contact + actions */}
                    <aside className="lg:sticky lg:top-24 h-max order-1 lg:order-2">
                        <div className="rounded-lg sm:rounded-xl border bg-white p-3 sm:p-4 md:p-6 shadow-sm">
                            <div className="text-sm text-muted-foreground">Price will be only</div>
                            <div className="mt-1 text-3xl font-extrabold">
                                ${property.price.toLocaleString()}
                            </div>
                            {property.originalPrice > property.price && (
                                <div className="text-xs text-red-600 line-through">
                                    ${property.originalPrice.toLocaleString()}
                                </div>
                            )}

                            <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-black">
                                <div className="rounded-md bg-secondary/10 px-2 py-1 text-center">
                                    {property.bedrooms} bd
                                </div>
                                <div className="rounded-md bg-secondary/10 px-2 py-1 text-center">
                                    {property.bathrooms} ba
                                </div>
                                <div className="rounded-md bg-secondary/10 px-2 py-1 text-center">
                                    {property.daysOnMarket}d market
                                </div>
                            </div>

                            <Link href={`/application/${property.id}`} className="mt-4 flex gap-2">
                                <Button className="flex-1">
                                    Apply for rent
                                </Button>
                            </Link>

                            {/* Agent Info */}
                            {/* <div className="mt-6 pt-6 border-t">
                                <h3 className="font-semibold text-sm">Listing Agent</h3>
                                <p className="text-sm text-muted-foreground mt-2">{property.listAgentName}</p>
                                <p className="text-sm text-muted-foreground">{property.listOfficeName}</p>
                                <div className="mt-3 space-y-2">
                                    <a
                                        href={`tel:${property.listAgentPhone}`}
                                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                                    >
                                        <Phone size={14} />
                                        {property.listAgentPhone}
                                    </a>
                                    <a
                                        href={`mailto:${property.listAgentEmail}`}
                                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                                    >
                                        <Mail size={14} />
                                        {property.listAgentEmail}
                                    </a>
                                </div>
                            </div> */}

                            {/* Contact Form */}
                            <form
                                className="mt-6 space-y-3"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const form = e.currentTarget as HTMLFormElement;
                                    const data = new FormData(form);
                                    const name = data.get("name") as string;
                                    try {
                                        const raw = localStorage.getItem("contacted") || "[]";
                                        const ids: string[] = JSON.parse(raw);
                                        if (!ids.includes(property.id)) ids.push(property.id);
                                        localStorage.setItem("contacted", JSON.stringify(ids));
                                    } catch { }
                                    toast.success(`Thanks ${name}, we will reach out soon.`);
                                    form.reset();
                                    window.dispatchEvent(new Event("contacted-change"));
                                }}
                            >
                                <div className="text-sm font-semibold">Contact Us</div>
                                <div className="grid gap-3">
                                    <div className="relative">
                                        <Input name="name" placeholder="Full name" required />
                                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                                            <ShieldCheck size={16} />
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            required
                                        />
                                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                                            <Mail size={16} />
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <Input name="phone" type="tel" placeholder="Phone" />
                                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                                            <Phone size={16} />
                                        </span>
                                    </div>
                                    <textarea
                                        name="message"
                                        placeholder="Message"
                                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                    <Button type="submit" className="w-full">
                                        Send message
                                    </Button>
                                </div>
                                <p className="mt-2 text-[10px] text-muted-foreground">
                                    By contacting, you agree to our Terms and Privacy Policy.
                                </p>
                            </form>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}
