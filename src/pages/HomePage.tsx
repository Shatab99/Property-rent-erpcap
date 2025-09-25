"use client"
import PropertyCard from '@/components/site/PropertyCard'
import SearchBar from '@/components/site/SearchBar'
import Testimonials from '@/components/site/Testimonials'
import { Button } from '@/components/ui/button'
import { properties } from '@/data/properties'
import { CheckCircle, Clock, Home, LineChart, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function HomePage() {
  return (
    <div className="">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2400&auto=format&fit=crop"
            alt="City skyline"
            className="h-[60vh] w-full object-cover"
            width={100}
            height={100}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center h-[60vh]">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl">
            Find your next home with confidence
          </h1>
          <p className="mt-4 text-white/90 max-w-2xl">
            Trusted rentals across the country. Compare, tour, and apply — all
            in one place.
          </p>
          <div className="mt-8 w-full max-w-3xl">
            <SearchBar />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-white/80 text-xs">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck size={16} /> Verified listings
            </div>
            <div className="inline-flex items-center gap-2">
              <Clock size={16} /> Instant tours
            </div>
            <div className="inline-flex items-center gap-2">
              <Home size={16} /> Trusted landlords
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Featured rentals
              </h2>
              <p className="text-muted-foreground mt-2">
                Hand-picked places you’ll love
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <a href="/listings">View all</a>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.slice(0, 6).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Search & filter",
                desc: "Refine by price, beds, location, pets, and more to find the perfect fit.",
                icon: <CheckCircle className="text-primary" size={24} />,
              },
              {
                title: "Tour instantly",
                desc: "Schedule in-person or virtual tours with one click — no back-and-forth.",
                icon: <Clock className="text-primary" size={24} />,
              },
              {
                title: "Apply securely",
                desc: "Submit applications and e-sign leases with bank-grade security.",
                icon: <ShieldCheck className="text-primary" size={24} />,
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="mt-4 font-semibold text-lg">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Loved by renters & landlords
              </h2>
              <p className="text-muted-foreground mt-2">
                Real reviews from our community
              </p>
            </div>
          </div>
          <div className="mt-8">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="py-16 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Market insights
              </h2>
              <p className="text-muted-foreground mt-2">
                Latest news and trends
              </p>
            </div>
            <Button variant="outline" className="hidden sm:inline-flex">
              View blog
            </Button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <article
                key={i}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <Image
                    width={400} height={300}
                    src={`https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop`}
                    alt="Market"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs text-primary inline-flex items-center gap-2 font-medium">
                    <LineChart size={14} /> Market Report
                  </div>
                  <h3 className="mt-2 font-semibold text-lg">
                    Rental prices cool in major metros
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Data shows a modest decrease in average rents across top
                    cities this quarter.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            List your property with confidence
          </h2>
          <p className="mt-2 text-black/90">
            Reach vetted renters and manage applications with ease.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="secondary" className="text-white bg-primary hover:bg-primary/80">
              Post a listing
            </Button>
            <Button
              variant="outline"
              className=" text-primary border-primary hover:bg-white/10"
            >
              Contact sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
