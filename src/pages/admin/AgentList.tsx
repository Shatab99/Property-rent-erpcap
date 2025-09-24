"use client";

import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Edit, Eye, Mail, Phone, Building2} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const mockAgents = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@agency.com",
    phone: "+1 (555) 987-6543",
    role: "Senior Agent",
    avatar: null,
    assignedProperties: 12,
    status: "active",
    dateJoined: "2023-06-15",
    specializations: ["Residential", "Luxury"],
    commission: 6.0,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@agency.com",
    phone: "+1 (555) 456-7890",
    role: "Sales Agent",
    avatar: null,
    assignedProperties: 8,
    status: "active",
    dateJoined: "2023-09-22",
    specializations: ["Commercial", "Rentals"],
    commission: 5.5,
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.wilson@agency.com",
    phone: "+1 (555) 321-0987",
    role: "Property Manager",
    avatar: null,
    assignedProperties: 15,
    status: "active",
    dateJoined: "2023-03-10",
    specializations: ["Residential", "Commercial"],
    commission: 5.0,
  },
  {
    id: "4",
    name: "David Brown",
    email: "david.brown@agency.com",
    phone: "+1 (555) 654-3210",
    role: "Team Lead",
    avatar: null,
    assignedProperties: 20,
    status: "inactive",
    dateJoined: "2022-11-08",
    specializations: ["Luxury", "Commercial"],
    commission: 7.0,
  },
];

export default function AgentList() {
  const router = useRouter();
  const [agents] = useState(mockAgents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    const matchesRole = roleFilter === "all" || agent.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="status-active">Active</span>;
      case "inactive":
        return <span className="status-inactive">Inactive</span>;
      default:
        return <span className="status-inactive">Unknown</span>;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      "Senior Agent": "bg-primary/10 text-primary border border-primary/20",
      "Sales Agent": "bg-accent/10 text-accent border border-accent/20",
      "Property Manager": "bg-success/10 text-success border border-success/20",
      "Team Lead": "bg-warning/10 text-warning border border-warning/20",
      "Broker": "bg-purple-50 text-purple-600 border border-purple-200",
    };

    const colorClass = roleColors[role as keyof typeof roleColors] || "bg-secondary text-secondary-foreground border border-border";

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>{role}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agent Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all agents in your property agency
          </p>
        </div>

        <Link href="/admin/add-agent">
          <Button
            className="admin-button-primary"
            onClick={() => router.push("/admin/agents/add")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Agent
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="admin-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {agents.filter(a => a.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Agents</div>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {agents.filter(a => a.status === "inactive").length}
            </div>
            <div className="text-sm text-muted-foreground">Inactive</div>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {agents.reduce((sum, agent) => sum + agent.assignedProperties, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Properties</div>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">
              {(agents.reduce((sum, agent) => sum + agent.commission, 0) / agents.length).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Commission</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="admin-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search agents by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="agent">Sales Agent</SelectItem>
                <SelectItem value="senior">Senior Agent</SelectItem>
                <SelectItem value="manager">Property Manager</SelectItem>
                <SelectItem value="lead">Team Lead</SelectItem>
                <SelectItem value="broker">Broker</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>All Agents ({filteredAgents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={agent.avatar ?? undefined} alt={agent.name} />
                          <AvatarFallback>
                            {agent.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {agent.specializations.join(", ")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                          {agent.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-1 h-3 w-3" />
                          {agent.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(agent.role)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building2 className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{agent.assignedProperties}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{agent.commission}%</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(agent.status)}</TableCell>
                    <TableCell>{agent.dateJoined}</TableCell>
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