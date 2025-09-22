import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckedState } from "@radix-ui/react-checkbox";

export type Filters = {
  query: string;
  price: [number, number];
  minBeds: number;
  pets: { cats: boolean; dogs: boolean };
  amenities: Record<string, boolean>;
};

const AMENITIES = [
  "Laundry",
  "Dishwasher",
  "Hardwood floors",
  "Doorman",
  "Gym",
  "Rooftop",
  "Backyard",
  "Garage",
  "Parking",
  "Stainless appliances",
];

export default function FiltersPanel({
  filters,
  setFilters,
  onApply,
  onReset,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onApply?: () => void;
  onReset?: () => void;
}) {
  const formatPrice = (n: number) => `$${n.toLocaleString()}`;
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          placeholder="City, neighborhood, ZIP"
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Price range</Label>
        <Slider
          value={[filters.price[0], filters.price[1]]}
          onValueChange={(v: number[]) =>
            setFilters({ ...filters, price: [v[0], v[1]] as [number, number] })
          }
          min={500}
          max={8000}
          step={50}
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(filters.price[0])}</span>
          <span>{formatPrice(filters.price[1])}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Bedrooms</Label>
        <Select
          value={String(filters.minBeds)}
          onValueChange={(v: string) => setFilters({ ...filters, minBeds: Number(v) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-1">Any</SelectItem>
            <SelectItem value="0">Studio</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Pet policy</Label>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={filters.pets.cats}
              onCheckedChange={(v: CheckedState) =>
                setFilters({
                  ...filters,
                  pets: { ...filters.pets, cats: Boolean(v) },
                })
              }
            />{" "}
            Cats
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={filters.pets.dogs}
              onCheckedChange={(v: CheckedState) =>
                setFilters({
                  ...filters,
                  pets: { ...filters.pets, dogs: Boolean(v) },
                })
              }
            />{" "}
            Dogs
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Amenities</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {AMENITIES.map((a) => (
            <label key={a} className="flex items-center gap-2">
              <Checkbox
                checked={Boolean(filters.amenities[a])}
                onCheckedChange={(v: CheckedState) =>
                  setFilters({
                    ...filters,
                    amenities: { ...filters.amenities, [a]: Boolean(v) },
                  })
                }
              />{" "}
              {a}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button onClick={onApply} className="flex-1">
          Apply
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  );
}
