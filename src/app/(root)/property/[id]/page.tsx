import PropertyDetails from '@/pages/PropertyDetails'
import React from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    return (
        <div>
            <PropertyDetails id={id} />
        </div>
    )
}
