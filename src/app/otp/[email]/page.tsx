import React from 'react'
import { OTPPage } from './_otpPage'

export default async function page({ params }: { params: Promise<{ email: string }> }) {
    const email = decodeURIComponent((await params).email)
    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-white'>
            <OTPPage email={email} />
        </div>
    )
}
