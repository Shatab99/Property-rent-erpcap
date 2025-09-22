export type Agent = {
  id: string;
  name: string;
  city: string;
  specialty: "Rentals" | "Buying" | "Luxury" | "Relocation";
  rating: number;
  phone: string;
  email: string;
  photo: string;
};

export const agents: Agent[] = [
  {
    id: "a1",
    name: "Alex Morgan",
    city: "New York, NY",
    specialty: "Rentals",
    rating: 4.8,
    phone: "(212) 555-0134",
    email: "alex.morgan@example.com",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "a2",
    name: "Priya Shah",
    city: "Chicago, IL",
    specialty: "Buying",
    rating: 4.7,
    phone: "(312) 555-0199",
    email: "priya.shah@example.com",
    photo:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "a3",
    name: "Diego Ramirez",
    city: "Austin, TX",
    specialty: "Relocation",
    rating: 4.6,
    phone: "(512) 555-0177",
    email: "diego.ramirez@example.com",
    photo:
      "https://images.unsplash.com/photo-1542204637-e67bc7d41e4b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "a4",
    name: "Sofia Rossi",
    city: "San Francisco, CA",
    specialty: "Luxury",
    rating: 4.9,
    phone: "(415) 555-0112",
    email: "sofia.rossi@example.com",
    photo:
      "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=1200&auto=format&fit=crop",
  },
];
