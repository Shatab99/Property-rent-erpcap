"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Eye, Mail, Loader } from "lucide-react";
import Link from "next/link";
import api from "@/lib/baseurl";
import { toastError } from "@/lib/toast";

interface Landlord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface LandlordsResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      perPage: number;
    };
    data: Landlord[];
  };
}

export default function LandlordLists() {
  const router = useRouter();
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(10);
  const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null;

  // Fetch landlords
  const fetchLandlords = async (page: number, search: string = "") => {
    try {
      setLoading(true);
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await api.get<LandlordsResponse>(
        `/admin/users?role=LANDLORD&page=${page}&limit=${perPage}${searchParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.data) {
        setLandlords(response.data.data.data);
        setCurrentPage(response.data.data.meta.currentPage);
        setTotalPages(response.data.data.meta.totalPages);
        setTotalItems(response.data.data.meta.totalItems);
      }
    } catch (error) {
      toastError("Failed to fetch landlords");
      console.error("Error fetching landlords:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLandlords(1);
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchLandlords(1, searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchLandlords(1, "");
  };

  const getStatusBadge = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "APPROVED":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Approved</span>;
      case "ACTIVE":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Active</span>;
      case "PENDING":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending</span>;
      case "REJECTED":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{upperStatus}</span>;
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchLandlords(newPage, searchTerm);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchLandlords(newPage, searchTerm);
    }
  };

  const handleLandlordClick = (landlordId: string) => {
    router.push(`/admin/landlords/${landlordId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Landlord Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all landlords in your property agency
          </p>
        </div>

        <Link href="/admin/landlords/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Landlord
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {totalItems}
            </div>
            <div className="text-sm text-muted-foreground">Total Landlords</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {landlords.filter(l => l.status === "ACTIVE").length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {landlords.filter(l => l.status === "PENDING").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="shadow-sm border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search landlords by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              Search Landlord
            </Button>
            {searchTerm && (
              <Button 
                onClick={handleClearSearch}
                variant="outline"
                className="gap-2"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Landlords Table */}
      <Card className="shadow-sm border">
        <CardHeader className="border-b">
          <CardTitle>All Landlords ({totalItems})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : landlords?.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">No landlords found</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold">Landlord</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Date Joined</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {landlords?.map((landlord) => (
                      <TableRow
                        key={landlord.id}
                        className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => handleLandlordClick(landlord.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {landlord.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">{landlord.name}</div>
                              <div className="text-xs text-muted-foreground">ID: {landlord.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-foreground">
                            <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                            {landlord.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            Landlord
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(landlord.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(landlord.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLandlordClick(landlord.id);
                            }}
                            className="hover:bg-primary/10 hover:text-primary"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing page <span className="font-semibold text-foreground">{currentPage}</span> of <span className="font-semibold text-foreground">{totalPages}</span> ({totalItems} total landlords)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1 || loading}
                      className="gap-2"
                    >
                      ← Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || loading}
                      className="gap-2"
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
