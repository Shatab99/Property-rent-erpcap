import Dashboard from '@/pages/Dashboard'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Dashboard - Sk Real Estate",
  description: "Manage your rental applications and saved properties in your personal dashboard.",
}

export default function page() {
  return (
    <div>
      <Dashboard />
    </div>
  )
}
