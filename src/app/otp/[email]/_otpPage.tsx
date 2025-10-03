'use client'
import { Button } from "@/components/ui/button"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from "react"
import { toast } from "sonner"

export function OTPPage({ email }: { email: string }) {

    const [otp, setOtp] = useState("")

    return (
        <div className='w-full max-w-md flex flex-col items-center rounded-xl border bg-white p-6 shadow-sm gap-5 '>
            <h1 className='text-2xl font-bold tracking-tight'>Verify your email</h1>
            <p className='mt-2 text-sm text-muted-foreground text-center'>We have sent a 6-digit verification code to <strong>{email}</strong></p>
            <InputOTP maxLength={6} onChange={(value) => setOtp(value)} value={otp} className='mt-4'>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <Button onClick={async () => {
                // toast.success("OTP Verified Successfully!", { position: "top-center" , richColors: true})
                toast.error("OTP Verification Failed!", { position: "top-center", richColors: true })
            }} className='mt-6 w-full max-w-xs' type='submit'>Verify OTP</Button>
            <p>{email}</p>
            <p>{otp}</p>
        </div>
    )
}



