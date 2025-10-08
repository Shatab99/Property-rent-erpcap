import ReviewApplication from '@/pages/admin/ReviewApplication'
import React, { Suspense } from 'react'

export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReviewApplication />
        </Suspense>
    )
}
