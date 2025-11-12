'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Phone, Calendar, MapPin, HelpCircle, Send, Loader2 } from "lucide-react";
import { getToken } from "@/lib/getToken";
import api from "@/lib/baseurl";
import { toastError } from "@/lib/toast";

interface InquiryData {
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
  data: InquiryData;
}

export default function InquiryDetails({ id }: { id: string }) {
  const router = useRouter();
  const token = getToken();

  const [inquiry, setInquiry] = useState<InquiryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch inquiry details
  useEffect(() => {
    const fetchInquiryDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiResponse>(
          `/admin/inquiries/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setInquiry(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching inquiry details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInquiryDetails();
    }
  }, [id, token]);

  const handleSendResponse = async () => {
    if (!responseMessage.trim() || !inquiry) return;

    try {
      setIsSubmitting(true);
      // TODO: Add API call to send response
      // await api.post(`/admin/inquiries/${id}/respond`, {
      //   message: responseMessage
      // }, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      toastError("For this feature you need to set up an email service like sendgrid");
      console.log("Response sent:", responseMessage);
      setResponseMessage("");
      // Optionally refresh the inquiry data
    } catch (error) {
      console.error("Error sending response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsResponded = async () => {
    if (!inquiry) return;

    try {
      setIsSubmitting(true);
      // TODO: Add API call to mark as responded
      await api.put(`/admin/inquiries/${id}/respond`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Marked as responded");
      // Update local state
      setInquiry({ ...inquiry, isResponded: true });
    } catch (error) {
      console.error("Error marking as responded:", error);
    } finally {
      setIsSubmitting(false);
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
          <p className="text-muted-foreground">Loading inquiry details...</p>
        </div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Inquiry Not Found</h2>
          <p className="text-muted-foreground mt-2">The requested inquiry could not be found.</p>
          <Button onClick={() => router.push("/admin/inquiries")} className="mt-4">
            Back to Inquiries
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/inquiries")}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inquiry Details</h1>
          <p className="text-muted-foreground mt-2">
            Inquiry from {inquiry.name} - #{inquiry.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <Card className="shadow-md border-0">
          <CardHeader className="border-b border-border bg-gray-50">
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* User Avatar and Name */}
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt={inquiry.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
                  {inquiry.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">{inquiry.name}</h3>
                <p className="text-sm text-muted-foreground">Inquirer</p>
              </div>
            </div>

            <Separator />

            {/* Contact Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground break-all">{inquiry.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{inquiry.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Inquiry Date</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(inquiry.createdAt)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Inquiry Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Type of Help</p>
                  {getHelpWithBadge(inquiry.helpWith)}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Zip Code</p>
                  <p className="text-sm font-medium text-foreground">{inquiry.zipCode}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Status</p>
              {getStatusBadge(inquiry.isResponded)}
            </div>
          </CardContent>
        </Card>

        {/* Inquiry Message and Response */}
        <Card className="shadow-md border-0 lg:col-span-2">
          <CardHeader className="border-b border-border bg-gray-50">
            <CardTitle className="text-lg">Inquiry Message & Response</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Original Inquiry */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Original Inquiry</h4>
              {inquiry.message ? (
                <div className="bg-slate-50 p-4 rounded-lg border border-border">
                  <p className="text-sm text-foreground leading-relaxed">{inquiry.message}</p>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground italic">No additional message provided</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Send Response */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Send Response via mail</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Reply to this inquiry to help the user
                </p>
              </div>

              <Textarea
                placeholder="Type your response here..."
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={5}
                className="resize-none border-border focus:ring-2 focus:ring-primary/20"
              />

              <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                <Button
                  onClick={handleSendResponse}
                  disabled={isSubmitting || !responseMessage.trim()}
                  className="flex-1 sm:flex-none px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg h-auto transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Response
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleMarkAsResponded}
                  disabled={isSubmitting || inquiry.isResponded}
                  variant="outline"
                  className="flex-1 sm:flex-none px-6 py-2 border-border text-foreground hover:bg-slate-50 font-medium rounded-lg h-auto transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : inquiry.isResponded ? (
                    "Marked as Responded"
                  ) : (
                    "Mark as Responded"
                  )}
                </Button>
              </div>

              {inquiry.isResponded && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">
                  ✓ This inquiry has been marked as responded
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}