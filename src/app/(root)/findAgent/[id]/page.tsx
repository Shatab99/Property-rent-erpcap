import FindAgentDetails from '@/pages/FindAgentDetails';
import React from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;


    return (
        <div>
            <FindAgentDetails id={id} />
        </div>
    )
}
