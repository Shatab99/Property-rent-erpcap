import EditProperty from '@/pages/agent/EditProperty';
import React from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;


    return (
        <div>
            <EditProperty id={id} />
        </div>
    )
}
