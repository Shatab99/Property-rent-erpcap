"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import api from "@/lib/baseurl"


interface Application {
  id: string
  applicantName: string
  applicantEmail: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  appliedAt: string
}

interface Meta {
  currentPage: number
  totalPages: number
  totalItems: number
}

interface Props {
  initialData: {
    meta: Meta
    result: Application[]
  }
  initialFilters: {
    page: number
    limit: number
    search: string
    status: string
  },
  token: string
}

export default function PropertyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [meta, setMeta] = useState<Meta>({ currentPage: 1, totalPages: 1, totalItems: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("ALL")
  const [page, setPage] = useState(1)
  const limit = 10

  const token = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null

  const router = useRouter()
  const searchParams = useSearchParams()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const fetchApplications = async () => {
    setLoading(true)
    setError("")

    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status !== "ALL" && { status }),
      })

      const response = await api.get(`/admin/property-application?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      // Access the correct nested structure from the response
      const { meta, result } = response.data.data

      setApplications(result || [])
      setMeta(meta || { currentPage: 1, totalPages: 1, totalItems: 0 })

      // Update URL (for SSR hydration)
      router.replace(`?${query.toString()}`)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  console.log(applications)

  useEffect(() => {
    fetchApplications()
  }, [page, status])

  const handleSearch = () => {
    setPage(1)
    fetchApplications()
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Property Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search & Filter */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 gap-2">
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="max-w-md"
                />
                <Button onClick={handleSearch} size="icon" disabled={loading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-red-500 py-6">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : applications?.length > 0 ? (
                    applications.map((app) => (
                      <TableRow onClick={() => router.push(`/admin/review-application/${app.id}`)} key={app.id}>
                        <TableCell className="font-medium">{app.applicantName}</TableCell>
                        <TableCell>{app.applicantEmail}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </TableCell>
                        <TableCell>{app.appliedAt}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                        No applications found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {meta?.totalPages >= 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing page {meta.currentPage} of {meta.totalPages} (
                  {meta.totalItems} total)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages || loading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
