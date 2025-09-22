import { Phone, Mail, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/data/agents";
import Image from "next/image";

export default function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-64 aspect-[4/3] overflow-hidden">
          <Image
            height={300} width={400}
            src={agent.photo}
            alt={agent.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const el = e.currentTarget;
              if (el.dataset.fallback !== "1") {
                el.src = "/placeholder.svg";
                el.dataset.fallback = "1";
              }
            }}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{agent.name}</h3>
              <div className="text-sm text-muted-foreground">
                {agent.city} • {agent.specialty}
              </div>
            </div>
            <div className="inline-flex items-center gap-1 text-sm font-medium">
              <Star className="text-yellow-500" size={16} />{" "}
              {agent.rating.toFixed(1)}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <Button asChild variant="outline" className="justify-start">
              <a href={`tel:${agent.phone}`}>
                <Phone className="mr-2" size={16} /> {agent.phone}
              </a>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <a href={`mailto:${agent.email}`}>
                <Mail className="mr-2" size={16} /> {agent.email}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
