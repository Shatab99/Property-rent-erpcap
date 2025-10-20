import FindAgent from '@/pages/FindAgent'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Find Agents - Sk Real Estate",
  description: "Browse and connect with professional real estate agents. Get expert help in finding your perfect rental property.",
}

export default function page() {
  return (
    <div>
      <FindAgent />
    </div>
  )
}
