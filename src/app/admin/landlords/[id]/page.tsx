import LandlordDetails from '@/pages/admin/LandlordDetails';
import React from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    return (
        <div>
            <LandlordDetails id={id} />
        </div>
    )
}
