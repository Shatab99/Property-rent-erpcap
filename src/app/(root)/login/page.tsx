

import Login from '@/pages/Login'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Login - Sk Real Estate",
  description: "Sign in to your Sk Real Estate account to manage your applications and saved listings.",
}

export default function page() {
  return (
    <div>
      <Login />
    </div>
  )
}