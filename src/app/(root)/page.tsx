import HomePage from '@/pages/HomePage'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Home - Rental Property",
  description: "Welcome to Rental Property. Browse thousands of properties available for rent. Find your perfect home today.",
}

export default function page() {
  return (
    <div>
      <HomePage />
    </div>
  )
}
