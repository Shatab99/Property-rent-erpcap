import UserDetails from '@/pages/admin/UserDetails';
import React from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div>
            <UserDetails id={id} />
        </div>
    )
}
