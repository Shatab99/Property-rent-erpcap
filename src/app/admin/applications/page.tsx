import React, { Suspense } from "react"
import PropertyApplicationsPage from "./_applicationPage"
import { cookies } from "next/headers"
import api from "@/lib/baseurl"

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const params = await searchParams

    // Extract filters from URL query
    const page = params.page || "1"
    const limit = params.limit || "15"
    const search = params.search || ""
    const status = params.status || "ALL"

    const query = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(status !== "ALL" && { status }),
    })

    try {
        const applications = await api.get(`/admin/property-application?${query.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return (
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <PropertyApplicationsPage
                        initialData={applications.data}
                        initialFilters={{ page: Number(page), limit: Number(limit), search, status }}
                        token={token || ""}
                    />
                </Suspense>
            </div>
        )
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch applications"
        const statusCode = error?.response?.status || 500
        
        console.error(`[Admin Applications] Error ${statusCode}:`, errorMessage)
        console.error("Full error:", error)

        // Return error UI
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-md border border-red-200 bg-red-50 p-6">
                        <h2 className="text-lg font-semibold text-red-900">Error Loading Applications</h2>
                        <p className="mt-2 text-sm text-red-700">
                            Status: {statusCode}
                        </p>
                        <p className="mt-1 text-sm text-red-700">
                            {errorMessage}
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}
