

import Overview from '@/pages/admin/Overview'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Admin Dashboard - Rental Property",
  description: "Manage properties, users, and inquiries from the admin dashboard.",
}

export default function page() {
  return (
    <div>
      <Overview />
    </div>
  )
}