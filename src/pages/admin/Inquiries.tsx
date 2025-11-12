"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, MessageSquare, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getToken } from "@/lib/getToken";
import api from "@/lib/baseurl";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  helpWith: string;
  zipCode: string;
  message: string | null;
  isResponded: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      perPage: number;
    };
    data: Inquiry[];
  };
}

export default function Inquiries() {
  const router = useRouter();
  const token = getToken();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  // Fetch inquiries
  const fetchInquiries = async (page: number, search: string, filter: string) => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse>(
        `/admin/inquiries?page=${page}&limit=${perPage}&search=${search}&filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setInquiries(response.data.data.data);
        setCurrentPage(response.data.data.meta.currentPage);
        setTotalPages(response.data.data.meta.totalPages);
        setTotalItems(response.data.data.meta.totalItems);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchInquiries(1, "", "all");
  }, [token]);

  // Setup polling - refresh data every 10 minutes
  useEffect(() => {
    const pollingInterval = setInterval(() => {
      console.log("Auto-refreshing inquiries data...");
      fetchInquiries(currentPage, searchTerm, filterStatus);
      setLastRefreshTime(new Date());
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    return () => clearInterval(pollingInterval);
  }, [currentPage, searchTerm, filterStatus]);

  // Handle search button click
  const handleSearchClick = () => {
    setSearchTerm(tempSearchTerm);
    setCurrentPage(1);
    fetchInquiries(1, tempSearchTerm, filterStatus);
  };

  // Handle Enter key press
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  // Handle filter
  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
    fetchInquiries(1, searchTerm, value);
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchInquiries(newPage, searchTerm, filterStatus);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchInquiries(newPage, searchTerm, filterStatus);
    }
  };

  const handleInquiryClick = (inquiryId: string) => {
    router.push(`/admin/inquiries/${inquiryId}`);
  };

  const getStatusBadge = (isResponded: boolean) => {
    if (isResponded) {
      return (
        <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-medium">
          Responded
        </span>
      );
    }
    return (
      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-medium">
        New
      </span>
    );
  };

  const getHelpWithBadge = (helpWith: string) => {
    const badgeColors: { [key: string]: { bg: string; text: string; border: string } } = {
      buying: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
      selling: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
      renting: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
      investing: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
      other: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
    };

    const color = badgeColors[helpWith] || badgeColors.other;
    return (
      <span className={`${color.bg} ${color.text} border ${color.border} px-3 py-1 rounded-full text-xs font-medium capitalize`}>
        {helpWith}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inquiries Management</h1>
        <p className="text-muted-foreground mt-1">Manage user inquiries and property questions</p>
        <p className="text-xs text-muted-foreground mt-3">
          Last refreshed: {lastRefreshTime.toLocaleTimeString()} (Auto-refresh every 10 min)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 bg-blue-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalItems}</div>
          <div className="text-sm text-muted-foreground">Total Inquiries</div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 bg-yellow-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {inquiries.filter((i) => !i.isResponded).length}
          </div>
          <div className="text-sm text-muted-foreground">New Inquiries</div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 bg-green-500">
            <Eye className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {inquiries.filter((i) => i.isResponded).length}
          </div>
          <div className="text-sm text-muted-foreground">Responded</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 flex items-center">
            <div className="w-full flex items-center border border-border rounded-lg overflow-hidden bg-white hover:border-primary/50 transition-colors">
              <div className="px-4 py-3 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <Input
                placeholder="Search by name, email, or phone..."
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="border-0 focus:ring-0 focus:outline-none flex-1 bg-transparent px-2 py-3 text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={handleSearchClick}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-none h-auto whitespace-nowrap transition-all"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Filter Dropdown */}
          <Select value={filterStatus} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full lg:w-56 border-border rounded-lg">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Inquiries</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            All Inquiries ({totalItems})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading inquiries...</span>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground text-center">No inquiries found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email & Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                  {inquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                      onClick={() => handleInquiryClick(inquiry.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-foreground">{inquiry.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground">{inquiry.email}</div>
                        <div className="text-sm text-muted-foreground">{inquiry.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getHelpWithBadge(inquiry.helpWith)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">{inquiry.zipCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(inquiry.isResponded)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(inquiry.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:bg-primary/10 flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInquiryClick(inquiry.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} ({totalItems} total)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
