"use client";
import Link from "next/link";
import { properties } from "@/data/properties";
import {
    BedSingle,
    Bath,
    Ruler,
    MapPin,
    ShieldCheck,
    Phone,
    Mail,
    CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function PropertyDetails({ id }: { id: string }) {
    // Hooks must always be at the top
    const [active, setActive] = useState<number>(0);
    const property = useMemo(() => properties.find((p) => p.id === id), [id]);

    // Early return if property not found
    if (!property) {
        return (
            <div className="bg-white">
                <section className="py-16">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-2xl font-bold">Listing not found</h1>
                        <p className="mt-2 text-muted-foreground">
                            The property you are looking for does not exist.
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/listings">Back to listings</Link>
                        </Button>
                    </div>
                </section>
            </div>
        );
    }

    const images = [property.image, property.image, property.image];
    const mapQuery = encodeURIComponent(property.location);

    return (
        <div className="bg-white">
            {/* Title + Meta */}
            <section className="border-b">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                {property.title}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                    <MapPin size={16} /> {property.location}
                                </span>
                                <span className="inline-flex items-center gap-1 text-green-600">
                                    <ShieldCheck size={16} /> Verified listing
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-extrabold">
                                ${property.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">per month</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-3">
                    {/* Left - gallery and details */}
                    <div className="lg:col-span-2">
                        {/* Gallery */}
                        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                            <div className="aspect-[16/9] overflow-hidden">
                                <Image
                                    width={400}
                                    height={300}
                                    src={images[active]}
                                    alt={property.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2 p-2">
                                {images.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActive(i)}
                                        className={`aspect-[4/3] overflow-hidden rounded-md ring-2 ${
                                            active === i ? "ring-primary" : "ring-transparent"
                                        }`}
                                    >
                                        <Image
                                            width={400}
                                            height={300}
                                            src={src}
                                            alt={`${property.title} ${i + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Specs */}
                        <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl border bg-white p-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <BedSingle className="text-foreground" size={18} />
                                <span className="text-foreground font-medium">
                                    {property.beds}
                                </span>{" "}
                                Beds
                            </div>
                            <div className="flex items-center gap-2">
                                <Bath className="text-foreground" size={18} />
                                <span className="text-foreground font-medium">
                                    {property.baths}
                                </span>{" "}
                                Baths
                            </div>
                            <div className="flex items-center gap-2">
                                <Ruler className="text-foreground" size={18} />
                                <span className="text-foreground font-medium">
                                    {property.sqft.toLocaleString()}
                                </span>{" "}
                                Sq Ft
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Description</h2>
                            <p className="mt-3 text-muted-foreground leading-relaxed">
                                Welcome to this thoughtfully maintained home featuring bright
                                living spaces, modern finishes, and convenient access to
                                transit, parks, and neighborhood amenities. Enjoy an open layout
                                perfect for entertaining, ample storage, and in-unit laundry.
                                Professionally managed with responsive support.
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Amenities</h2>
                            <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                                {[
                                    "In-unit laundry",
                                    "Central A/C",
                                    "Stainless appliances",
                                    "Dishwasher",
                                    "Hardwood floors",
                                    "Pet friendly",
                                    "Assigned parking",
                                    "On-site maintenance",
                                    "Secure entry",
                                ].map((a) => (
                                    <li key={a} className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />{" "}
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Map */}
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Location</h2>
                            <div className="mt-3 overflow-hidden rounded-xl border">
                                <iframe
                                    title="map"
                                    src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                                    loading="lazy"
                                    className="h-72 w-full border-0"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right - contact + actions */}
                    <aside className="lg:sticky lg:top-24 h-max">
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <div className="text-sm text-muted-foreground">Monthly rent</div>
                            <div className="mt-1 text-3xl font-extrabold">
                                ${property.price.toLocaleString()}
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                                <div className="rounded-md bg-secondary/40 px-2 py-1 text-center">
                                    {property.beds} bd
                                </div>
                                <div className="rounded-md bg-secondary/40 px-2 py-1 text-center">
                                    {property.baths} ba
                                </div>
                                <div className="rounded-md bg-secondary/40 px-2 py-1 text-center">
                                    {property.sqft.toLocaleString()} sqft
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button className="flex-1">
                                    <CalendarDays className="mr-2" size={16} /> Schedule tour
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    Apply now
                                </Button>
                            </div>
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
                                    } catch {}
                                    toast.success(`Thanks ${name}, we will reach out soon.`);
                                    form.reset();
                                    window.dispatchEvent(new Event("contacted-change"));
                                }}
                            >
                                <div className="text-sm font-semibold">Contact landlord</div>
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
