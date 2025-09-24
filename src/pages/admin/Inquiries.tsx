"use client";

import { useState } from "react";
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
import { Search, Eye, MessageSquare, Calendar } from "lucide-react";

const mockInquiries = [
  {
    id: "1",
    userName: "John Smith",
    userEmail: "john.smith@email.com",
    propertyId: "P001",
    propertyName: "Modern Downtown Apartment",
    message:
      "I'm interested in scheduling a viewing for this property. Is it available this weekend?",
    date: "2024-01-23",
    status: "new",
    priority: "medium",
  },
  {
    id: "2",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@email.com",
    propertyId: "P002",
    propertyName: "Luxury Family House",
    message:
      "Could you provide more information about the lease terms and pet policy?",
    date: "2024-01-22",
    status: "replied",
    priority: "high",
  },
  {
    id: "3",
    userName: "Michael Chen",
    userEmail: "m.chen@email.com",
    propertyId: "P003",
    propertyName: "Commercial Office Space",
    message:
      "I'm looking for a commercial space for my startup. Can we discuss the pricing and availability?",
    date: "2024-01-21",
    status: "pending",
    priority: "high",
  },
  {
    id: "4",
    userName: "Emma Wilson",
    userEmail: "emma.wilson@email.com",
    propertyId: "P001",
    propertyName: "Modern Downtown Apartment",
    message:
      "Is parking included with this rental? Also, what are the utility costs?",
    date: "2024-01-20",
    status: "closed",
    priority: "low",
  },
];

export default function Inquiries() {
  const router = useRouter();
  const [inquiries] = useState(mockInquiries);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-xs font-medium">
            New
          </span>
        );
      case "replied":
        return (
          <span className="bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full text-xs font-medium">
            Replied
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-50 text-yellow-600 border border-yellow-200 px-3 py-1 rounded-full text-xs font-medium">
            Pending
          </span>
        );
      case "closed":
        return (
          <span className="bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-xs font-medium">
            Closed
          </span>
        );
      default:
        return (
          <span className="bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-xs font-medium">
            Unknown
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <span className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full text-xs font-medium">
            High
          </span>
        );
      case "medium":
        return (
          <span className="bg-yellow-50 text-yellow-600 border border-yellow-200 px-3 py-1 rounded-full text-xs font-medium">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-xs font-medium">
            Low
          </span>
        );
      default:
        return (
          <span className="bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-xs font-medium">
            Unknown
          </span>
        );
    }
  };

  const handleInquiryClick = (inquiryId: string) => {
    router.push(`/admin/inquiries/${inquiryId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Inquiries Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage user inquiries and property questions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 bg-blue-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {inquiries.filter((i) => i.status === "new").length}
          </div>
          <div className="text-sm text-muted-foreground">New Inquiries</div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 bg-yellow-500">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {inquiries.filter((i) => i.status === "pending").length}
          </div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 bg-green-500">
            <Eye className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {inquiries.filter((i) => i.status === "replied").length}
          </div>
          <div className="text-sm text-muted-foreground">Replied</div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 bg-gray-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {inquiries.filter((i) => i.status === "closed").length}
          </div>
          <div className="text-sm text-muted-foreground">Closed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center border rounded-lg px-3">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <Input
              placeholder="Search inquiries by user, email, or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 focus:ring-0 focus:outline-none flex-1"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            All Inquiries ({filteredInquiries.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
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
              {filteredInquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleInquiryClick(inquiry.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-foreground">
                        {inquiry.userName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {inquiry.userEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-foreground">
                        {inquiry.propertyName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ID: {inquiry.propertyId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-sm text-muted-foreground">
                    {inquiry.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(inquiry.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(inquiry.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {inquiry.date}
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
      </div>
    </div>
  );
}
