import Listings from '@/pages/Listings'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Property Listings - Sk Real Estate",
  description: "Browse all available rental properties. Filter by price, location, and features to find your ideal home.",
}

export default function page() {
  return (
    <div>
      <Listings />
    </div>
  )
}
