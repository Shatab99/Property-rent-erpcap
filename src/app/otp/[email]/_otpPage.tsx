'use client'
import { Button } from "@/components/ui/button"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import api from "@/lib/baseurl"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function OTPPage({ email }: { email: string }) {

    const [otp, setOtp] = useState("")
    const router = useRouter();

    const [timer, setTimer] = useState(300);

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className='w-full max-w-md flex flex-col items-center rounded-xl border bg-white p-6 shadow-sm gap-5 '>
            <h1 className='text-2xl font-bold tracking-tight'>Verify your email in {formatTime(timer)}</h1>
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
            <div className="text-sm text-muted-foreground flex justify-between max-w-xs w-full px-2">
                <p>Didn't receive the code?</p>
                <button className="text-blue-500 hover:underline" onClick={async () => {
                    const res = await api.post("/auth/resend-otp", { email })
                    if (!res.data.success) {
                        toast.error("Failed to resend OTP!", { position: "top-center", richColors: true })
                        return;
                    }
                    toast.success("OTP Resent Successfully!", { position: "top-center", richColors: true })
                    setTimer(300);
                }}>Resend OTP</button>
            </div>

            <Button onClick={async () => {
                const res = await api.post("/auth/verify-otp", { email, otp: Number(otp) })
                if (!res.data.success) {
                    toast.error("OTP Verification Failed!", { position: "top-center", richColors: true })
                    return;
                }
                toast.success("OTP Verified Successfully!", { position: "top-center", richColors: true })
                router.push("/login");
            }} className='w-full max-w-xs' type='submit' disabled={timer === 0}>Verify OTP</Button>
        </div>
    )
}



