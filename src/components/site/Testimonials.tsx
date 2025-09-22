import { Star } from "lucide-react";

const items = [
  {
    name: "Ava M.",
    text: "Found my dream apartment and toured the same day. Completely seamless!",
  },
  {
    name: "Daniel K.",
    text: "As a landlord, listing and screening tenants was straightforward and fast.",
  },
  {
    name: "Priya S.",
    text: "Great filters and trustworthy listings. I loved the map + grid view.",
  },
];

export default function Testimonials() {
  return (
    <div className="relative">
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.name}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-1 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <p className="mt-3 text-sm text-foreground">“{it.text}”</p>
            <p className="mt-4 text-sm font-semibold">{it.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
