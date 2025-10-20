import Contact from '@/pages/Contact'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact Us - Sk Real Estate",
  description: "Get in touch with our team. We're here to help you find the perfect rental property.",
}

export default function page() {
  return (
    <div>
      <Contact />
    </div>
  )
}
