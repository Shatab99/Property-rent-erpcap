import React, { Suspense } from 'react'
import PropertyApplicationsPage from './_applicationPage'

export default function page() {
    return (
        <Suspense>
            <PropertyApplicationsPage />
        </Suspense>
    )
}
