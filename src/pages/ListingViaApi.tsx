'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Property {
  title: string
  price: string
  address: string
  bedrooms: string
  bathrooms: string
  sqft: string
  image: string
  link: string
  mlsNumber: string
}

export default function ListingViaApi() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showIframe, setShowIframe] = useState(true)

  const fetchProperties = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/scape-mypage')
      const data = await response.json()
      
      if (data.success) {
        setProperties(data.properties || [])
        console.log('Scraped data:', data)
      } else {
        setError(data.error || 'Failed to fetch properties')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-[90vh] p-6 mb-16'>
      <div className="mb-4 flex gap-4 items-center">
        <Button onClick={fetchProperties} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Scrape Local Listings
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowIframe(!showIframe)}
        >
          {showIframe ? 'Hide' : 'Show'} Iframe
        </Button>
        <span className="text-sm text-gray-500">
          (Scrapes from localhost:3000/listings + takes screenshot)
        </span>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {properties.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Scraped Properties ({properties.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
            {properties.map((property, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-sm">{property.title || 'Property Title'}</CardTitle>
                  <CardDescription className="text-lg font-bold text-green-600">
                    {property.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{property.address}</p>
                  <div className="flex gap-4 text-sm">
                    <span>{property.bedrooms} bed</span>
                    <span>{property.bathrooms} bath</span>
                    <span>{property.sqft}</span>
                  </div>
                  {property.mlsNumber && (
                    <p className="text-xs text-gray-500 mt-2">MLS: {property.mlsNumber}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {showIframe && (
        <div className="h-full">
          <iframe 
            src="https://matrix-new.onekeymlsny.com/Matrix/public/IDX.aspx?idx=02882c54" 
            width="100%" 
            height="100%"
            className="border rounded"
          />
        </div>
      )}
    </div>
  )
}
