"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/lib/toast";
import api from "@/lib/baseurl";
import { useState, useEffect } from "react";
import { Loader, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator"
import Image from "next/image";

export default function SignupAsLandLord() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState<"landlord" | "agent" | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Step 1: Welcome Screen
    const WelcomeScreen = () => (
        <div className={`space-y-3 sm:space-y-5 lg:space-y-8 transition-all duration-700 transform ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <div className="text-center lg:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 animate-fade-in leading-tight">
                    Welcome to SK Real Estate
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-5 lg:mb-8 animate-fade-in-delay max-w-sm lg:max-w-none">
                    Transform your real estate business with our intelligent platform designed for landlords and agents who want to succeed.
                </p>
            </div>

            {/* Quick Stats - Mobile Optimized */}
            <div className="grid grid-cols-3 gap-2 py-2.5 sm:py-4 border-y border-gray-200">
                <div className="text-center">
                    <p className="text-lg sm:text-xl lg:text-3xl font-bold text-blue-600">5K+</p>
                    <p className="text-xs text-gray-600 leading-tight">Properties</p>
                </div>
                <div className="text-center">
                    <p className="text-lg sm:text-xl lg:text-3xl font-bold text-purple-600">2.5K+</p>
                    <p className="text-xs text-gray-600 leading-tight">Agents</p>
                </div>
                <div className="text-center">
                    <p className="text-lg sm:text-xl lg:text-3xl font-bold text-green-600">98%</p>
                    <p className="text-xs text-gray-600 leading-tight">Happy</p>
                </div>
            </div>

            {/* Why Join Section - Mobile Optimized */}
            <div className="space-y-1.5">
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Why Join SK Real Estate?</h3>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5 flex-shrink-0 font-bold">✓</span>
                        <span>Access to thousands of qualified tenants and buyers</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5 flex-shrink-0 font-bold">✓</span>
                        <span>Professional verification and background checks</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5 flex-shrink-0 font-bold">✓</span>
                        <span>Advanced tools to showcase and manage properties</span>
                    </li>
                </ul>
            </div>

            <Button
                onClick={() => setStep(2)}
                size="lg"
                className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg transition-all hover:scale-105 h-9 sm:h-10 lg:h-11 text-xs sm:text-sm"
            >
                Get Started <ArrowRight size={16} className="hidden sm:inline" />
            </Button>
        </div>
    );

    // Step 2: User Type Selection
    const UserTypeSelection = () => (
        <div className={`space-y-4 sm:space-y-6 transition-all duration-700 transform ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}`}>
            <div className="text-center lg:text-left">
                <h2 className="text-lg sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Tell us who you are
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                    Choose your account type to unlock tailored features and opportunities
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 lg:mt-8">
                {/* Landlord Option */}
                <button
                    onClick={() => {
                        setUserType("landlord");
                        setStep(3);
                    }}
                    className="group relative overflow-hidden rounded-xl border-2 border-transparent bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 lg:p-8 text-left transition-all hover:border-blue-500 hover:shadow-xl hover:scale-105 duration-300"
                >
                    <div className="relative z-10">
                        <div className="mb-3 sm:mb-4 text-4xl sm:text-5xl lg:text-6xl">🏠</div>
                        <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">Property Owner</h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                            List your properties, find qualified tenants, and manage everything in one place.
                        </p>
                        <div className="space-y-0.5 text-xs text-gray-600">
                            <p>✓ Reach thousands of tenants</p>
                            <p>✓ Background checks included</p>
                            <p>✓ Flexible lease management</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 transition-opacity group-hover:opacity-10"></div>
                </button>

                {/* Agent Option */}
                <button
                    onClick={() => {
                        setUserType("agent");
                        setStep(3);
                    }}
                    className="group relative overflow-hidden rounded-xl border-2 border-transparent bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 lg:p-8 text-left transition-all hover:border-purple-500 hover:shadow-xl hover:scale-105 duration-300"
                >
                    <div className="relative z-10">
                        <div className="mb-3 sm:mb-4 text-4xl sm:text-5xl lg:text-6xl">👔</div>
                        <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">Real Estate Agent</h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                            Grow your business with access to motivated buyers and sellers.
                        </p>
                        <div className="space-y-0.5 text-xs text-gray-600">
                            <p>✓ Exclusive listings access</p>
                            <p>✓ Lead generation tools</p>
                            <p>✓ Commission tracking</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-400 to-purple-600 opacity-0 transition-opacity group-hover:opacity-10"></div>
                </button>
            </div>

            <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full mt-4 sm:mt-6 lg:mt-8 h-10 sm:h-11 text-sm"
            >
                Go Back
            </Button>
        </div>
    );

    // Landlord Form
    const LandlordForm = () => (
        <form
            className="space-y-3 sm:space-y-4 lg:space-y-5 transition-all duration-500"
            onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                    const form = e.currentTarget as HTMLFormElement;
                    const data = new FormData(form);

                    const name = String(data.get("name"));
                    const email = String(data.get("email"));
                    const password = String(data.get("password"));
                    const phone = String(data.get("phone"));
                    const nidImage = data.get("nidImage") as File;
                    const profilePicture = data.get("profilePicture") as File;

                    if (!nidImage || !profilePicture) {
                        toastError("Please upload all required images", { position: "bottom-center" });
                        return;
                    }

                    const formData = new FormData();
                    formData.append("name", name);
                    formData.append("email", email);
                    formData.append("password", password);
                    formData.append("phone", phone);
                    formData.append("nidImage", nidImage);
                    formData.append("profilePicture", profilePicture);
                    formData.append("userType", "landlord");

                    const res = await api.post("/users/create-landlord", formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });

                    if (!res.data.success) {
                        toastError(res.data.message || "Something went wrong", { position: "bottom-center" });
                        return;
                    }

                    window.dispatchEvent(new Event("auth-change"));
                    toastSuccess("Email sent! Please check your inbox.", { position: "top-center" });
                    form.reset();
                    router.push(`/otp/${email}`);
                } catch (error: any) {
                    toastError(error?.response?.data?.message || error.message || "Something went wrong", { position: "bottom-center" });
                } finally {
                    setLoading(false);
                }
            }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm font-medium">Full Name</Label>
                    <Input id="name" name="name" placeholder="John Doe" className="h-10 sm:h-11 text-sm" required />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="phone" className="text-xs sm:text-sm font-medium">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" className="h-10 sm:h-11 text-sm" required />
                </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" className="h-10 sm:h-11 text-sm" required />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm font-medium">Password</Label>
                <Input id="password" name="password" type="password" className="h-10 sm:h-11 text-sm" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 pt-1 sm:pt-2">
                <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="nidImage" className="text-xs sm:text-sm font-medium">National ID Card</Label>
                    <Input id="nidImage" name="nidImage" type="file" accept="image/*" className="h-10 sm:h-11 cursor-pointer text-sm" required />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="profilePicture" className="text-xs sm:text-sm font-medium">Profile Picture</Label>
                    <Input id="profilePicture" name="profilePicture" type="file" accept="image/*" className="h-10 sm:h-11 cursor-pointer text-sm" required />
                    <p className="text-xs text-muted-foreground mt-1">Must match your NID photo</p>
                </div>
            </div>

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 h-10 sm:h-11 text-sm font-semibold mt-2" disabled={loading}>
                {loading ? <Loader className="animate-spin mr-2 h-4 w-4" /> : null}
                Complete Sign Up as Landlord
            </Button>
        </form>
    );

    // Agent Form
    const AgentForm = () => (
        <form
            className="space-y-3 sm:space-y-4 lg:space-y-5 transition-all duration-500"
            onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                    const form = e.currentTarget as HTMLFormElement;
                    const data = new FormData(form);

                    const name = String(data.get("name"));
                    const email = String(data.get("email"));
                    const password = String(data.get("password"));
                    const phone = String(data.get("phone"));
                    const nidImage = data.get("nidImage") as File;
                    const profilePicture = data.get("profilePicture") as File;
                    const agentLicense = data.get("agentLicense") as File;

                    if (!nidImage || !profilePicture || !agentLicense) {
                        toastError("Please upload all required images", { position: "bottom-center" });
                        return;
                    }

                    const formData = new FormData();
                    formData.append("name", name);
                    formData.append("email", email);
                    formData.append("password", password);
                    formData.append("phone", phone);
                    formData.append("nidImage", nidImage);
                    formData.append("profilePicture", profilePicture);
                    formData.append("agentLicense", agentLicense);
                    formData.append("userType", "agent");

                    const res = await api.post("/users/create-agent", formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });

                    if (!res.data.success) {
                        toastError(res.data.message || "Something went wrong", { position: "bottom-center" });
                        return;
                    }

                    window.dispatchEvent(new Event("auth-change"));
                    toastSuccess("Email sent! Please check your inbox.", { position: "top-center" });
                    form.reset();
                    router.push(`/otp/${email}`);
                } catch (error: any) {
                    toastError(error?.response?.data?.message || error.message || "Something went wrong", { position: "bottom-center" });
                } finally {
                    setLoading(false);
                }
            }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm font-medium">Full Name</Label>
                    <Input id="name" name="name" placeholder="Jane Smith" className="h-10 sm:h-11 text-sm" required />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="phone" className="text-xs sm:text-sm font-medium">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" className="h-10 sm:h-11 text-sm" required />
                </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" className="h-10 sm:h-11 text-sm" required />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm font-medium">Password</Label>
                <Input id="password" name="password" type="password" className="h-10 sm:h-11 text-sm" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 pt-1 sm:pt-2">
                <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="nidImage" className="text-xs sm:text-sm font-medium">National ID Card</Label>
                    <Input id="nidImage" name="nidImage" type="file" accept="image/*" className="h-10 sm:h-11 cursor-pointer text-sm" required />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="profilePicture" className="text-xs sm:text-sm font-medium">Profile Picture</Label>
                    <Input id="profilePicture" name="profilePicture" type="file" accept="image/*" className="h-10 sm:h-11 cursor-pointer text-sm" required />
                    <p className="text-xs text-muted-foreground mt-1">Must match your NID photo</p>
                </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
                <Label htmlFor="agentLicense" className="text-xs sm:text-sm font-medium">Agent License Photo</Label>
                <Input id="agentLicense" name="agentLicense" type="file" accept="image/*" className="h-10 sm:h-11 cursor-pointer text-sm" required />
            </div>

            <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 h-10 sm:h-11 text-sm font-semibold mt-2" disabled={loading}>
                {loading ? <Loader className="animate-spin mr-2 h-4 w-4" /> : null}
                Complete Sign Up as Agent
            </Button>
        </form>
    );

    // Step 3: Form Selection
    const FormStep = () => (
        <div className={`transition-all duration-700 transform ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}`}>
            <div className="mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">{userType === "landlord" ? "🏠" : "👔"}</span>
                    <span className="text-base sm:text-lg">{userType === "landlord" ? "Sign up as Landlord" : "Sign up as Agent"}</span>
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                    Complete your profile to get started
                </p>
            </div>

            {userType === "landlord" ? <LandlordForm /> : <AgentForm />}

            <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="w-full mt-4 sm:mt-6 lg:mt-8"
            >
                Go Back
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-6 sm:py-8 lg:py-16">
            <section className="py-3 sm:py-4 lg:py-8">
                <div className="mx-auto max-w-sm px-4 sm:max-w-2xl sm:px-6 md:max-w-5xl lg:max-w-7xl lg:px-8">
                    {/* Desktop Layout: Two Column */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20 items-center">
                        {/* Left Side: Branding & Features (Responsive) */}
                        <div className={`flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8 pr-0 sm:pr-4 lg:pr-8 ${step > 1 ? "hidden lg:flex" : "flex"}`}>
                            <div className="flex flex-col items-center sm:items-center lg:items-start">
                                <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-auto lg:h-auto mb-3 sm:mb-4">
                                    <Image src="/logo.png" alt="SK Real Estate" width={300} height={300} className="w-full h-full object-contain" />
                                </div>
                                <p className="text-lg sm:text-xl lg:text-xl text-gray-700 font-medium leading-relaxed text-center sm:text-center lg:text-left">
                                    The Complete Platform for Modern Real Estate Professionals
                                </p>
                            </div>

                            {/* Key Features */}
                            <div className="space-y-3 sm:space-y-4">
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide text-center lg:text-left">Platform Features</h4>
                                {[
                                    { icon: "📋", title: "Smart Listings", desc: "Professional property showcases that attract qualified tenants" },
                                    { icon: "🔍", title: "Advanced Search", desc: "AI-powered tenant and buyer matching technology" },
                                    { icon: "✓", title: "Verified Users", desc: "Government ID verification for maximum safety" },
                                    { icon: "📊", title: "Analytics Dashboard", desc: "Track inquiries, viewings, and performance metrics" }
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex gap-2 sm:gap-3 items-start">
                                        <div className="flex-shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 text-sm sm:text-lg">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{feature.title}</h3>
                                            <p className="text-xs text-gray-600">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Why Real Estate Matters */}
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">💡 Real Estate Insights</h4>
                                <ul className="space-y-1.5 sm:space-y-2 text-xs text-gray-700">
                                    <li>• The rental market grows 5-7% annually in most regions</li>
                                    <li>• Property owners with verified tenants see 3x fewer disputes</li>
                                    <li>• Digital platforms reduce vacancy time by up to 60%</li>
                                    <li>• Agents using smart tools close deals 40% faster</li>
                                </ul>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex gap-1.5 sm:gap-2 pt-2 justify-center lg:justify-start flex-wrap">
                                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg text-xs">
                                    <span>🏆</span>
                                    <span className="font-medium text-gray-700">Trusted</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg text-xs">
                                    <span>🔒</span>
                                    <span className="font-medium text-gray-700">Secure</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg text-xs">
                                    <span>⚡</span>
                                    <span className="font-medium text-gray-700">Fast</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Form Card */}
                        <div className="w-full">
                            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-10 shadow-2xl">

                                <div className="mb-4 sm:mb-6">
                                    {/* Step Content */}
                                    {step === 1 && <WelcomeScreen />}
                                    {step === 2 && <UserTypeSelection />}
                                    {step === 3 && <FormStep />}
                                </div>

                                {/* Footer Links for Step 1 */}
                                {step === 1 && (
                                    <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600 border-t pt-4 sm:pt-6">
                                        Already have an account?{" "}
                                        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                            Log in
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Stats (Only visible on mobile, replaces bottom badges) */}
                            <div className="mt-4 sm:mt-6 lg:hidden grid grid-cols-2 gap-3">
                                <div className="text-center bg-white rounded-lg p-3 border border-gray-200">
                                    <p className="text-lg sm:text-xl font-bold text-blue-600">5K+</p>
                                    <p className="text-xs text-gray-600">Properties</p>
                                </div>
                                <div className="text-center bg-white rounded-lg p-3 border border-gray-200">
                                    <p className="text-lg sm:text-xl font-bold text-purple-600">2.5K+</p>
                                    <p className="text-xs text-gray-600">Agents</p>
                                </div>
                                <div className="text-center bg-white rounded-lg p-3 border border-gray-200">
                                    <p className="text-lg sm:text-xl font-bold text-green-600">98%</p>
                                    <p className="text-xs text-gray-600">Satisfaction</p>
                                </div>
                                <div className="text-center bg-white rounded-lg p-3 border border-gray-200">
                                    <p className="text-lg sm:text-xl font-bold text-orange-600">4.8★</p>
                                    <p className="text-xs text-gray-600">Ratings</p>
                                </div>
                            </div>

                            {/* Mobile Trust Badges (Visible only on mobile) */}
                            <div className="mt-3 sm:mt-4 lg:hidden grid grid-cols-3 gap-2 text-center text-xs text-gray-600 p-3 bg-gray-50 rounded-lg">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-lg">🔒</span>
                                    <span className="font-medium">Secure</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-lg">✓</span>
                                    <span className="font-medium">Verified</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-lg">🚀</span>
                                    <span className="font-medium">Quick</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
