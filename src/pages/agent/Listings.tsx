"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Eye, MapPin } from "lucide-react";

const mockListings = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    address: "123 Main St, Downtown",
    price: "$2,500/month",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    status: "active",
    dateAdded: "2024-01-15",
    agent: "Sarah Johnson",
  },
  {
    id: "2",
    title: "Luxury Family House",
    address: "456 Oak Ave, Suburbs",
    price: "$4,200/month",
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    status: "inactive",
    dateAdded: "2024-01-10",
    agent: "Michael Chen",
  },
  {
    id: "3",
    title: "Commercial Office Space",
    address: "789 Business Blvd",
    price: "$3,800/month",
    type: "Commercial",
    bedrooms: 0,
    bathrooms: 2,
    status: "pending",
    dateAdded: "2024-01-20",
    agent: "Emma Wilson",
  },
];

export default function Listings() {
  const router = useRouter();
  const [listings] = useState(mockListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="status-active">Active</span>;
      case "inactive":
        return <span className="status-inactive">Inactive</span>;
      case "pending":
        return <span className="status-pending">Pending</span>;
      default:
        return <span className="status-inactive">Unknown</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Property Listings</h1>
          <p className="text-muted-foreground mt-2">
            Manage all property listings in your system
          </p>
        </div>
        
        <Button 
          className="admin-button-primary"
          onClick={() => router.push('/agent/add-property')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Filters */}
      <Card className="admin-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>All Properties ({filteredListings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{listing.title}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          {listing.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{listing.type}</TableCell>
                    <TableCell className="font-medium">{listing.price}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {listing.bedrooms > 0 && `${listing.bedrooms} bed, `}
                        {listing.bathrooms} bath
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(listing.status)}</TableCell>
                    <TableCell>{listing.agent}</TableCell>
                    <TableCell>{listing.dateAdded}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}