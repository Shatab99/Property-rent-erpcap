import Signup from '@/pages/Signup'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sign Up - Sk Real Estate",
  description: "Create an account with Sk Real Estate to start your rental journey. Browse, apply, and connect with landlords.",
}

export default function page() {
  return (
    <div>
      <Signup />
    </div>
  )
}
