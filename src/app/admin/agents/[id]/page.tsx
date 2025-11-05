import AgentDetails from '@/pages/admin/AgentDetails';
import React from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    return (
        <div>
            <AgentDetails id={id} />
        </div>
    )
}
