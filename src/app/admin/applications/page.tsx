import React, { Suspense } from "react"
import PropertyApplicationsPage from "./_applicationPage"
import { baseURL } from "@/lib/baseurl"
import { cookies } from "next/headers"

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

    const response = await fetch(`${baseURL}/admin/property-application?${query.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    })

    const applications = await response.json()

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
}
