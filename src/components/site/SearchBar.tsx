import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, SlidersHorizontal } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="w-full rounded-xl bg-white/95 shadow-lg ring-1 ring-black/5 p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
      <div className="flex-1 flex items-center gap-2 border rounded-md px-3 py-2 bg-white">
        <MapPin className="text-muted-foreground" size={18} />
        <Input
          placeholder="City, address, or ZIP"
          className="border-0 focus-visible:ring-0 px-0"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal size={16} /> Filters
        </Button>
        <Button className="px-6">Search</Button>
      </div>
    </div>
  );
}
