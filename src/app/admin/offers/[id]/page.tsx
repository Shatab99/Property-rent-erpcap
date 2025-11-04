import OfferDetails from '@/pages/admin/OfferDetails';
import React from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    return (
        <div>
            <OfferDetails id={id} />
        </div>
    )
}
