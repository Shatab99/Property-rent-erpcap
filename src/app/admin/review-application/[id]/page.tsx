import ReviewApplication from '@/pages/admin/ReviewApplication'
import { cookies } from 'next/headers'
import React, { Suspense } from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const cS = await cookies()
    const token = cS.get("token")?.value

    if (!token) {
        return <div>Please login to access this page.</div>
    }
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReviewApplication id={id} token={token} />
        </Suspense>
    )
}
