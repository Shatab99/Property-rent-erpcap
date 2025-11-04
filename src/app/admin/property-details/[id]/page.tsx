import PropertyDetailsAdmin from '@/pages/admin/PropertyDetailsAdmin';
import React from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    return (
        <div>
            <PropertyDetailsAdmin id={id} />
        </div>
    )
}
