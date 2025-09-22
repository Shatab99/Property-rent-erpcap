"use client";

import { useMemo, useState } from "react";
import { agents } from "@/data/agents";
import AgentCard from "@/components/site/AgentCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FindAgent() {
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState<string>("any");
  const [minRating, setMinRating] = useState<number>(0);

  const specialties = useMemo(
    () => Array.from(new Set(agents.map((a) => a.specialty))),
    [],
  );

  const filtered = agents.filter(
    (a) =>
      (!city || a.city.toLowerCase().includes(city.toLowerCase())) &&
      (specialty === "any" || a.specialty === specialty) &&
      a.rating >= minRating,
  );

  return (
    <div className="bg-white">
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Find an agent
          </h1>
          <p className="mt-1 text-muted-foreground">
            Search top-rated agents to help with your rental or purchase.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {specialties.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(minRating)}
              onValueChange={(v) => setMinRating(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Min rating" />
              </SelectTrigger>
              <SelectContent>
                {[0, 3, 4, 4.5].map((r) => (
                  <SelectItem key={r} value={String(r)}>
                    {r === 0 ? "Any rating" : `${r}+`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 grid gap-4">
            {filtered.map((a) => (
              <AgentCard key={a.id} agent={a} />
            ))}
            {filtered.length === 0 && (
              <div className="rounded-xl border bg-white p-6 text-center text-muted-foreground">
                No agents match your filters.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

