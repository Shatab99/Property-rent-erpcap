import PropertyDetails from '@/pages/PropertyDetails'
import React from 'react'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: `Property Details - Sk Real Estate`,
        description: `View detailed information about this rental property. Browse photos, features, and contact the landlord.`,
    };
}

export default async function page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    return (
        <div>
            <PropertyDetails id={id} />
        </div>
    )
}
