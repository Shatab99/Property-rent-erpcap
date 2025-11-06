import InquiryDetails from '@/pages/admin/InquiryDetails'
import React from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div>
            <InquiryDetails id={id} />
        </div>
    )
}
