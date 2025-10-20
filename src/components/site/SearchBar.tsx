import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListIcon, MapPin, Sliders, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {

  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const search = () => {
    if (searchInput.trim() === "") return;
    router.push(`/listings?search=${searchInput}`);
  }

  return (
    <div className="w-full rounded-xl bg-white/95 shadow-lg ring-1 ring-black/5 p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
      <div className="flex-1 flex items-center gap-2 border rounded-md px-3 py-2 bg-white">
        <MapPin className="text-muted-foreground" size={18} />
        <Input
          placeholder="Search properties by location, title.."
          className="border-0 focus-visible:ring-0 px-0"
          onChange={(e) => setSearchInput(e.target.value)}
        />
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
