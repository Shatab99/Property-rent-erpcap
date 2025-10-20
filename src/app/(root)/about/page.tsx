import About from '@/pages/About'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About Us - Sk Real Estate",
  description: "Learn about Sk Real Estate. Our mission is to make finding and renting properties simple and affordable.",
}

export default function page() {
  return (
    <div>
      <About />
    </div>
  )
}
