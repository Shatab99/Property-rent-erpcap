"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Mail, Phone, Loader, MessageCircle, Star } from "lucide-react";
import api from "@/lib/baseurl";
import { toastError } from "@/lib/toast";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
}

interface AgentResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
    data: Agent[];
  };
}

export default function FindAgent() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(12);

  useEffect(() => {
    fetchAgents(1, "");
  }, []);

  const fetchAgents = async (page: number, search: string = "") => {
    try {
      setLoading(true);
      const response = await api.get<AgentResponse>(
        `/agent/all-agents?search=${encodeURIComponent(search)}&page=${page}&limit=${perPage}`
      );

      if (response.data.success && response.data.data) {
        setAgents(response.data.data.data);
        setCurrentPage(response.data.data.meta.currentPage);
        setTotalPages(response.data.data.meta.totalPages);
        setTotalItems(response.data.data.meta.totalItems);
      }
    } catch (error) {
      toastError("Failed to fetch agents");
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAgents(1, searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchAgents(1, "");
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchAgents(newPage, searchTerm);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchAgents(newPage, searchTerm);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Find an Agent
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Search and connect with top-rated agents to help with your rental or purchase.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search agents by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Search className="h-4 w-4" />
                Search
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
          </div>

          {/* Stats */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{agents.length}</span> of <span className="font-semibold text-foreground">{totalItems}</span> agents
            </p>
          </div>

          {/* Agents List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : agents.length === 0 ? (
            <div className="rounded-xl border bg-white p-12 text-center">
              <p className="text-lg text-muted-foreground">No agents found. Try adjusting your search.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {agents.map((agent) => (
                  <Card key={agent.id} className="shadow-md border hover:shadow-lg hover:border-primary/50 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-6 p-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <Avatar className="h-24 w-24 border-2 border-slate-200 rounded-full">
                            <AvatarImage src={agent.profileImage} alt={agent.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl">
                              {agent.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Main Info */}
                        <div className="flex-1 min-w-0">
                          {/* Name and Title */}
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-foreground">{agent.name}</h3>
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600" title="Verified">
                              <span className="text-sm font-bold">✓</span>
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">Real Estate Agent</p>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-foreground">5.0</span>
                            <span className="text-sm text-muted-foreground">• 6 reviews • 3 testimonials</span>
                          </div>

                          {/* Stats */}
                          <div className="flex flex-col sm:flex-row gap-6 text-sm mb-4">
                            <div>
                              <p className="text-muted-foreground">Price Range</p>
                              <p className="font-semibold text-foreground">$10k - $1.8M</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Sales in Last 12 Months</p>
                              <p className="font-semibold text-foreground">65 sales</p>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="flex flex-col sm:flex-row gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                              <Mail className="h-4 w-4 flex-shrink-0" />
                              <a href={`mailto:${agent.email}`} className="hover:underline truncate">
                                {agent.email}
                              </a>
                            </div>
                            {agent.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <a href={`tel:${agent.phone}`} className="hover:underline">
                                  {agent.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Contact Button */}
                        <div className="flex-shrink-0">
                          <Button className="gap-2 bg-primary hover:bg-primary/90 whitespace-nowrap">
                            <MessageCircle className="h-4 w-4" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between pt-6 border-t gap-4">
                  <div className="text-sm text-muted-foreground">
                    Page <span className="font-semibold text-foreground">{currentPage}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
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
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

