import type { Property } from "@/components/site/PropertyCard";

export const properties: Property[] = [
  {
    id: "p1",
    title: "Sunny 2BR near Central Park",
    price: 3250,
    location: "Upper West Side, NYC",
    beds: 2,
    baths: 1,
    sqft: 920,
    image:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
    ],
    pets: { cats: true, dogs: false },
    amenities: ["Laundry", "Dishwasher", "Hardwood floors", "Doorman"],
  },
  {
    id: "p2",
    title: "Modern loft with skyline views",
    price: 4200,
    location: "Downtown, Chicago",
    beds: 1,
    baths: 1,
    sqft: 750,
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
    ],
    pets: { cats: true, dogs: true },
    amenities: ["Gym", "Rooftop", "Stainless appliances"],
  },
  {
    id: "p3",
    title: "Family home with backyard",
    price: 2850,
    location: "Berkeley, CA",
    beds: 3,
    baths: 2,
    sqft: 1400,
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
    ],
    pets: { cats: true, dogs: true },
    amenities: ["Backyard", "Garage", "Dishwasher"],
  },
  {
    id: "p4",
    title: "Cozy studio near tech hub",
    price: 1950,
    location: "Austin, TX",
    beds: 0,
    baths: 1,
    sqft: 520,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
    ],
    pets: { cats: false, dogs: false },
    amenities: ["Stainless appliances"],
  },
  {
    id: "p5",
    title: "Townhouse in quiet neighborhood",
    price: 3100,
    location: "Seattle, WA",
    beds: 3,
    baths: 2,
    sqft: 1320,
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
    ],
    pets: { cats: true, dogs: true },
    amenities: ["Hardwood floors", "Laundry", "Parking"],
  },
  {
    id: "p6",
    title: "Renovated duplex with garage",
    price: 2450,
    location: "Denver, CO",
    beds: 2,
    baths: 2,
    sqft: 1100,
      image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
    ],
    pets: { cats: false, dogs: true },
    amenities: ["Garage", "Gym"],
  },
];
