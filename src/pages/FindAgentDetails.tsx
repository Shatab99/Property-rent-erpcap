"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Mail,
    Phone,
    MapPin,
    Globe,
    Award,
    Languages,
    Star,
    Loader2,
    ArrowLeft,
    Share2,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import api from "@/lib/baseurl";
import { toastError, toastSuccess } from "@/lib/toast";

interface AgentDetails {
    id: string;
    userId: string;
    minBudget: number;
    maxBudget: number;
    officeName: string;
    officeAddress: string;
    officePhone: string;
    website: string;
    licenseNumber: string;
    experience: string;
    targetedCity: string;
    otherLanguages: string[];
    aboutAgent: string;
    specialties: string[];
    reviews: any[];
    rating: number;
    createdAt: string;
    updatedAt: string;
    userDetails: {
        name: string;
        email: string;
        phone: string;
        profileImage: string;
    };
}

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    helpWith: string;
    zipCode: string;
}

interface ReviewFormData {
    email: string;
    fullName: string;
    phone: string;
    addressOfProperty: string;
    workedWithAgentYear: number;
    responsiveRate: number;
    marketExpertiseRate: number;
    negotiationRate: number;
    professionalismRate: number;
    comment: string;
}

interface Review {
    id: string;
    agentProfileId: string;
    isVerified: boolean;
    email: string;
    fullName: string;
    phone: string;
    addressOfProperty: string;
    workedWithAgentYear: number;
    responsiveRate: number;
    marketExpertiseRate: number;
    negotiationRate: number;
    professionalismRate: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

interface ReviewsApiResponse {
    success: boolean;
    message: string;
    data: {
        meta: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
        };
        data: Review[];
    };
}

export default function FindAgentDetails({ id }: { id: string }) {
    const router = useRouter();
    const [agent, setAgent] = useState<AgentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        helpWith: "",
        zipCode: "",
    });

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsCurrentPage, setReviewsCurrentPage] = useState(1);
    const [reviewsTotalPages, setReviewsTotalPages] = useState(1);
    const [reviewsTotalItems, setReviewsTotalItems] = useState(0);
    const reviewsPerPage = 10;
    const [reviewFormData, setReviewFormData] = useState<ReviewFormData>({
        email: "",
        fullName: "",
        phone: "",
        addressOfProperty: "",
        workedWithAgentYear: new Date().getFullYear(),
        responsiveRate: 0,
        marketExpertiseRate: 0,
        negotiationRate: 0,
        professionalismRate: 0,
        comment: "",
    });

    useEffect(() => {
        fetchAgentDetails();
    }, [id]);

    useEffect(() => {
        if (agent) {
            fetchReviews(1);
        }
    }, [agent]);

    const fetchAgentDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/agent/details/${id}`);

            if (response.data.success && response.data.data) {
                setAgent(response.data.data);
            } else {
                toastError("Failed to load agent details");
            }
        } catch (error) {
            toastError("Error fetching agent details");
            console.error("Error fetching agent details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReviewInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setReviewFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) : value,
        }));
    };

    const handleReviewStarClick = (fieldName: string, rating: number) => {
        setReviewFormData((prev) => ({
            ...prev,
            [fieldName]: rating,
        }));
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingReview(true);

        try {
            if (!reviewFormData.email.trim() || !reviewFormData.fullName.trim()) {
                toastError("Please fill in required fields");
                setIsSubmittingReview(false);
                return;
            }

            // TODO: Add your review submission API call here
            await api.post(`/agent/make-review/${id}`, reviewFormData);

            toastSuccess("Review submitted successfully!");
            setIsReviewModalOpen(false);
            setReviewFormData({
                email: "",
                fullName: "",
                phone: "",
                addressOfProperty: "",
                workedWithAgentYear: new Date().getFullYear(),
                responsiveRate: 0,
                marketExpertiseRate: 0,
                negotiationRate: 0,
                professionalismRate: 0,
                comment: "",
            });
            // Refresh reviews list after successful submission
            await fetchReviews(1);
        } catch (error) {
            toastError(error instanceof Error ? error.message : "Failed to submit review");
            console.error("Error submitting review:", error);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleSubmitContactForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate form
            if (
                !formData.name.trim() ||
                !formData.email.trim() ||
                !formData.phone.trim() ||
                !formData.helpWith.trim() ||
                !formData.zipCode.trim()
            ) {
                toastError("Please fill in all fields");
                setIsSubmitting(false);
                return;
            }

            // TODO: Add your contact submission API call here
            await api.post('/booking/make-inquiry', formData);

            toastSuccess("Message sent successfully!");
            setFormData({ name: "", email: "", phone: "", helpWith: "", zipCode: "" });
        } catch (error) {
            toastError(
                error instanceof Error ? error.message : "Failed to send message"
            );
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchReviews = async (page: number = 1) => {
        try {
            setReviewsLoading(true);
            const response = await api.get(`/agent/all-reviews/${id}?page=${page}&limit=${reviewsPerPage}`);
            
            if (response.data.success) {
                const { data, meta } = response.data.data;
                setReviews(data);
                setReviewsCurrentPage(meta.currentPage);
                setReviewsTotalPages(meta.totalPages);
                setReviewsTotalItems(meta.totalItems);
            }
        } catch (error) {
            toastError(
                error instanceof Error ? error.message : "Failed to load reviews"
            );
            console.error("Error fetching reviews:", error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleReviewsPreviousPage = () => {
        if (reviewsCurrentPage > 1) {
            fetchReviews(reviewsCurrentPage - 1);
        }
    };

    const handleReviewsNextPage = () => {
        if (reviewsCurrentPage < reviewsTotalPages) {
            fetchReviews(reviewsCurrentPage + 1);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-600">Loading agent details...</p>
                </div>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <div className="text-center">
                    <p className="text-lg text-slate-600 mb-4">Agent not found</p>
                    <Button onClick={() => router.back()} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Agents
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Agent Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Agent Header Card - Compact Design */}
                        <Card className="shadow-md border border-slate-300">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                                    {/* Left: Avatar and Info */}
                                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                                        {/* Avatar - Circular */}
                                        <Avatar className="h-16 sm:h-20 w-16 sm:w-20 border-2 border-slate-300 flex-shrink-0">
                                            <AvatarImage
                                                src={agent.userDetails.profileImage}
                                                alt={agent.userDetails.name}
                                            />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg sm:text-2xl">
                                                {agent.userDetails.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Agent Info */}
                                        <div className="flex-1 min-w-0">
                                            {/* Name with Verification Badge */}
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight">
                                                    {agent.userDetails.name}
                                                </h2>
                                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0" title="Verified">
                                                    <span className="text-xs font-bold">✓</span>
                                                </span>
                                            </div>

                                            {/* Office Name */}
                                            <p className="text-xs sm:text-sm text-amber-600 font-semibold mb-1 truncate">
                                                {agent.officeName}
                                            </p>

                                            {/* Experience */}
                                            <p className="text-xs sm:text-sm text-slate-700 font-medium mb-2">
                                                {agent.experience} of experience
                                            </p>

                                            {/* Rating and Reviews */}
                                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3 sm:h-4 w-3 sm:w-4 ${i < Math.round(agent.rating)
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'fill-slate-200 text-slate-200'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs sm:text-sm font-semibold text-slate-900">
                                                    {agent.rating.toFixed(1)}
                                                </span>
                                                <a
                                                    href="#reviews"
                                                    className="text-xs sm:text-sm text-slate-700 hover:text-blue-600 transition font-medium underline whitespace-nowrap"
                                                >
                                                    {agent.reviews.length} {agent.reviews.length === 1 ? 'review' : 'reviews'}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Share and Contact Buttons */}
                                    <div className="flex gap-2 sm:gap-3 flex-shrink-0 mt-3 sm:mt-0 sm:flex-col">
                                        {/* Share Button */}
                                        <button
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: agent.userDetails.name,
                                                        text: `Check out ${agent.userDetails.name} - ${agent.officeName}`,
                                                        url: window.location.href,
                                                    });
                                                }
                                            }}
                                            className="p-2 border border-slate-400 rounded-full hover:bg-slate-100 transition flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10"
                                            title="Share"
                                        >
                                            <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                                        </button>

                                        {/* Contact Button */}
                                        <Button
                                            onClick={() => {
                                                const element = document.querySelector('#contact-form');
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                            className="px-3 sm:px-6 py-2 bg-white border border-slate-900 text-slate-900 hover:bg-slate-50 font-semibold rounded-lg sm:rounded-full h-auto whitespace-nowrap text-xs sm:text-sm"
                                        >
                                            Contact
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* About Agent */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="border-b border-slate-200 bg-slate-50">
                                <CardTitle className="text-xl text-slate-900">
                                    About {agent.userDetails.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                    {agent.aboutAgent}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Experience & License */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="shadow-md border-0">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <Award className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="text-sm text-slate-600 font-medium">
                                                Experience
                                            </p>
                                            <p className="text-lg font-semibold text-slate-900">
                                                {agent.experience}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-md border-0">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <Award className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="text-sm text-slate-600 font-medium">
                                                License #
                                            </p>
                                            <p className="text-lg font-semibold text-slate-900">
                                                {agent.licenseNumber}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Budget Range */}
                        <Card className="shadow-md border-0">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-slate-900 mb-4">
                                    Budget Range
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Minimum</p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            ${(agent.minBudget / 1000).toFixed(0)}k
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Maximum</p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            ${(agent.maxBudget / 1000).toFixed(0)}k
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Targeted City */}
                        <Card className="shadow-md border-0">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-slate-900 mb-3">
                                    Targeted City
                                </h3>
                                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-sm">
                                    {agent.targetedCity}
                                </Badge>
                            </CardContent>
                        </Card>

                        {/* Specialties */}
                        {agent.specialties && agent.specialties.length > 0 && (
                            <Card className="shadow-md border-0">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-slate-900 mb-3">
                                        Specialties
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {agent.specialties.map((specialty) => (
                                            <Badge
                                                key={specialty}
                                                className="bg-emerald-100 text-emerald-800 px-3 py-1"
                                            >
                                                {specialty}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Languages */}
                        {agent.otherLanguages && agent.otherLanguages.length > 0 && (
                            <Card className="shadow-md border-0">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <Languages className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-2">
                                                Languages Spoken
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {agent.otherLanguages.map((language) => (
                                                    <Badge
                                                        key={language}
                                                        className="bg-purple-100 text-purple-800 px-3 py-1"
                                                    >
                                                        {language}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Ratings and Reviews Section */}
                        <Card className="shadow-md border-0">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-slate-900">
                                        Ratings and reviews ({agent.reviews.length})
                                    </h3>
                                    <Button
                                        onClick={() => setIsReviewModalOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 h-auto rounded-lg"
                                    >
                                        Rate and Review
                                    </Button>
                                </div>

                                {/* Overall Rating */}
                                <div className="mb-6 pb-6 border-b border-slate-200">
                                    <p className="text-sm text-slate-600 mb-2">Overall rating</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-5 w-5 ${i < Math.round(agent.rating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'fill-slate-200 text-slate-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-2xl font-bold text-slate-900">
                                            {agent.rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Loading State */}
                                {reviewsLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                                    </div>
                                ) : reviews && reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {reviews.map((review, index) => {
                                            // Calculate average rating from all 4 rating fields
                                            const avgRating = (
                                                review.responsiveRate +
                                                review.marketExpertiseRate +
                                                review.negotiationRate +
                                                review.professionalismRate
                                            ) / 4;

                                            return (
                                                <div key={index} className="pb-4 border-b border-slate-200 last:border-b-0">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-slate-900">{review.fullName}</p>
                                                            <p className="text-sm text-slate-600">{review.addressOfProperty}</p>
                                                            {review.isVerified && (
                                                                <Badge className="mt-1 bg-green-100 text-green-800">Verified</Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 ${i < Math.round(avgRating)
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'fill-slate-200 text-slate-200'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Individual Ratings Grid */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 bg-slate-50 p-3 rounded-lg">
                                                        <div>
                                                            <p className="text-xs text-slate-600 font-medium mb-1">Responsiveness</p>
                                                            <div className="flex items-center gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-3 w-3 ${i < review.responsiveRate
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'fill-slate-300 text-slate-300'
                                                                            }`}
                                                                    />
                                                                ))}
                                                                <span className="text-xs font-semibold text-slate-900 ml-1">{review.responsiveRate}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-600 font-medium mb-1">Market Expertise</p>
                                                            <div className="flex items-center gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-3 w-3 ${i < review.marketExpertiseRate
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'fill-slate-300 text-slate-300'
                                                                            }`}
                                                                    />
                                                                ))}
                                                                <span className="text-xs font-semibold text-slate-900 ml-1">{review.marketExpertiseRate}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-600 font-medium mb-1">Negotiation</p>
                                                            <div className="flex items-center gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-3 w-3 ${i < review.negotiationRate
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'fill-slate-300 text-slate-300'
                                                                            }`}
                                                                    />
                                                                ))}
                                                                <span className="text-xs font-semibold text-slate-900 ml-1">{review.negotiationRate}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-600 font-medium mb-1">Professionalism</p>
                                                            <div className="flex items-center gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-3 w-3 ${i < review.professionalismRate
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'fill-slate-300 text-slate-300'
                                                                            }`}
                                                                    />
                                                                ))}
                                                                <span className="text-xs font-semibold text-slate-900 ml-1">{review.professionalismRate}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {review.comment && (
                                                        <p className="text-slate-700 text-sm">{review.comment}</p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-600 py-8">No reviews yet. Be the first to review this agent.</p>
                                )}

                                {/* Pagination Controls */}
                                {!reviewsLoading && reviewsTotalPages > 1 && (
                                    <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
                                        <p className="text-sm text-slate-600">
                                            Page <span className="font-semibold">{reviewsCurrentPage}</span> of{' '}
                                            <span className="font-semibold">{reviewsTotalPages}</span> ({reviewsTotalItems} total)
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleReviewsPreviousPage}
                                                disabled={reviewsCurrentPage === 1}
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </Button>
                                            <Button
                                                onClick={handleReviewsNextPage}
                                                disabled={reviewsCurrentPage === reviewsTotalPages}
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1"
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="lg:col-span-1" id="contact-form">
                        <Card className="shadow-lg border sticky top-8 border-slate-300">
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmitContactForm} className="space-y-5">
                                    <h2 className="text-xl font-bold text-slate-900 mb-4">
                                        What do you need help with?
                                    </h2>

                                    {/* Help With - Dropdown */}
                                    <div className="space-y-2">
                                        <Label htmlFor="helpWith" className="text-sm text-slate-700">
                                            Choose an option:
                                            <span className="text-slate-500 text-xs font-normal float-right">
                                                required
                                            </span>
                                        </Label>
                                        <select
                                            id="helpWith"
                                            name="helpWith"
                                            value={formData.helpWith}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-slate-400 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none cursor-pointer"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M0 0l6 8 6-8z'/%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 12px center',
                                                paddingRight: '36px',
                                            }}
                                        >
                                            <option value="">Choose from list</option>
                                            <option value="buying">Buying a property</option>
                                            <option value="selling">Selling a property</option>
                                            <option value="renting">Renting a property</option>
                                            <option value="investing">Real estate investing</option>
                                            <option value="other">Other inquiry</option>
                                        </select>
                                    </div>

                                    {/* Zip Code with Icon */}
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode" className="text-sm text-slate-700">
                                            Where are you buying or selling?
                                            <span className="text-slate-500 text-xs font-normal float-right">
                                                required
                                            </span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="zipCode"
                                                name="zipCode"
                                                type="text"
                                                placeholder="Enter zip code"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                className="px-4 py-3 border border-slate-400 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition pr-12"
                                            />
                                            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Section Divider */}
                                    <div className="my-6 border-t border-slate-300"></div>

                                    <h3 className="text-lg font-bold text-slate-900">Your information</h3>

                                    {/* Name */}
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Full name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="px-4 py-3 border border-slate-400 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition pr-12 placeholder:text-slate-500"
                                            />
                                            <svg
                                                className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="px-4 py-3 border border-slate-400 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition pr-12 placeholder:text-slate-500"
                                            />
                                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="Phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="px-4 py-3 border border-slate-400 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition pr-12 placeholder:text-slate-500"
                                            />
                                            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="mt-6 px-8 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full h-auto w-auto"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            "Submit"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Rate and Review Modal */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border-0 overflow-hidden rounded-2xl">
                        {/* Modal Header - Fixed */}
                        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between flex-shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Rate and review
                                </h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    {agent?.userDetails.name}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsReviewModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition flex-shrink-0"
                                title="Close"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <CardContent className="p-8 overflow-y-auto flex-1">
                            <form id="reviewForm" onSubmit={handleSubmitReview} className="space-y-6">
                                {/* Tell us about your experience */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                        Tell us about your experience
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-4">
                                        How do I ensure my review is published?{" "}
                                        <span className="text-slate-400">ⓘ</span>
                                    </p>

                                    {/* Year dropdown */}
                                    <div className="mb-4">
                                        <Label htmlFor="workedWithAgentYear" className="text-sm font-semibold text-slate-700">
                                            Year you worked with the agent
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="workedWithAgentYear"
                                            name="workedWithAgentYear"
                                            value={reviewFormData.workedWithAgentYear.toString()}
                                            onChange={(e) => {
                                                setReviewFormData((prev) => ({
                                                    ...prev,
                                                    workedWithAgentYear: parseInt(e.target.value, 10),
                                                }));
                                            }}
                                            className="w-full px-4 py-3 mt-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        >
                                            <option value="">Select</option>
                                            {[...Array(20)].map((_, i) => {
                                                const year = new Date().getFullYear() - i;
                                                return (
                                                    <option key={year} value={year.toString()}>
                                                        {year}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        {!reviewFormData.workedWithAgentYear && (
                                            <p className="text-red-500 text-sm mt-1">Please enter the year you worked with the agent</p>
                                        )}
                                    </div>

                                    {/* Buyer/Seller Radio */}
                                    <div className="mb-4">
                                        <Label className="text-sm font-semibold text-slate-700 block mb-2">I was a:</Label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="transactionType"
                                                    value="buyer"
                                                    defaultChecked
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-slate-700">Buyer</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="transactionType"
                                                    value="seller"
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-slate-700">Seller</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Star Ratings */}
                                    <div className="space-y-4 mb-6">
                                        {[
                                            { field: "responsiveRate", label: "Responsiveness" },
                                            { field: "marketExpertiseRate", label: "Market expertise" },
                                            { field: "negotiationRate", label: "Negotiation skills" },
                                            { field: "professionalismRate", label: "Professionalism & communication" },
                                        ].map(({ field, label }) => (
                                            <div key={field}>
                                                <Label className="text-sm font-semibold text-slate-700 block mb-2">
                                                    {label}
                                                </Label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((rating) => (
                                                        <button
                                                            key={rating}
                                                            type="button"
                                                            onClick={() =>
                                                                handleReviewStarClick(
                                                                    field as keyof ReviewFormData,
                                                                    rating
                                                                )
                                                            }
                                                            className="focus:outline-none"
                                                        >
                                                            <Star
                                                                className={`h-6 w-6 transition-all ${rating <=
                                                                    (reviewFormData[field as keyof ReviewFormData] as number)
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "fill-slate-200 text-slate-200 hover:fill-yellow-200"
                                                                    }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-slate-200"></div>

                                {/* Your Information */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Your information</h3>

                                    <div className="space-y-4">
                                        {/* Full Name */}
                                        <div>
                                            <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700">
                                                Full name<span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                type="text"
                                                placeholder="Full name"
                                                value={reviewFormData.fullName}
                                                onChange={handleReviewInputChange}
                                                className="mt-2 border-slate-300"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                                Email<span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="Email"
                                                value={reviewFormData.email}
                                                onChange={handleReviewInputChange}
                                                className="mt-2 border-slate-300"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                                                Phone
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="Phone"
                                                value={reviewFormData.phone}
                                                onChange={handleReviewInputChange}
                                                className="mt-2 border-slate-300"
                                            />
                                        </div>

                                        {/* Address of Property */}
                                        <div>
                                            <Label htmlFor="addressOfProperty" className="text-sm font-semibold text-slate-700">
                                                Address of property
                                            </Label>
                                            <Input
                                                id="addressOfProperty"
                                                name="addressOfProperty"
                                                type="text"
                                                placeholder="Address"
                                                value={reviewFormData.addressOfProperty}
                                                onChange={handleReviewInputChange}
                                                className="mt-2 border-slate-300"
                                            />
                                        </div>

                                        {/* Review Comment */}
                                        <div>
                                            <Label htmlFor="comment" className="text-sm font-semibold text-slate-700">
                                                Your review
                                            </Label>
                                            <Textarea
                                                id="comment"
                                                name="comment"
                                                placeholder="Please enter your review"
                                                value={reviewFormData.comment}
                                                onChange={handleReviewInputChange}
                                                rows={4}
                                                className="mt-2 border-slate-300 resize-none"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">
                                                Maximum character count is 4,000.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div></div>
                            </form>
                        </CardContent>

                        {/* Modal Footer - Fixed */}
                        <div className="sticky bottom-0 z-10 bg-white border-t border-slate-200 px-8 py-4 flex gap-4 flex-shrink-0">
                            <Button
                                form="reviewForm"
                                type="submit"
                                disabled={isSubmittingReview}
                                className="px-6 py-2 bg-black hover:bg-slate-900 text-white font-semibold rounded-lg h-auto transition"
                            >
                                {isSubmittingReview ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Review"
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsReviewModalOpen(false)}
                                className="px-6 py-2 border border-slate-300 text-slate-900 hover:bg-slate-50 font-medium rounded-lg h-auto transition"
                            >
                                Cancel
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}