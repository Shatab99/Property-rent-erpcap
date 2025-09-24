import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Phone, Calendar, Building2, Send } from "lucide-react";

const mockInquiryData = {
  "1": {
    id: "1",
    userName: "John Smith",
    userEmail: "john.smith@email.com",
    userPhone: "+1 (555) 123-4567",
    propertyId: "P001",
    propertyName: "Modern Downtown Apartment",
    propertyAddress: "123 Main St, Downtown",
    message: "I'm interested in scheduling a viewing for this property. Is it available this weekend? I work downtown and this location would be perfect for my commute. Could you also let me know about parking availability and if pets are allowed?",
    date: "2024-01-23",
    status: "new",
    priority: "medium",
    responses: [
      {
        from: "admin",
        message: "Thank you for your interest! I'd be happy to schedule a viewing for you this weekend. The property does include one parking space and we do allow pets with a small deposit. Would Saturday afternoon work for you?",
        date: "2024-01-23 14:30",
      }
    ]
  }
};

export default function InquiryDetails({ }) {
  const id = "1"
  const router = useRouter();
  const inquiry = mockInquiryData[id as keyof typeof mockInquiryData];

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-full text-xs font-medium">New</span>;
      case "replied":
        return <span className="status-active">Replied</span>;
      case "pending":
        return <span className="status-pending">Pending</span>;
      case "closed":
        return <span className="status-inactive">Closed</span>;
      default:
        return <span className="status-inactive">Unknown</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-full text-xs font-medium">High</span>;
      case "medium":
        return <span className="bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-1 rounded-full text-xs font-medium">Medium</span>;
      case "low":
        return <span className="bg-gray-50 text-gray-600 border border-gray-200 px-2 py-1 rounded-full text-xs font-medium">Low</span>;
      default:
        return <span className="status-inactive">Unknown</span>;
    }
  };

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
            Inquiry from {inquiry.userName} - #{inquiry.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User & Property Info */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt={inquiry.userName} />
                <AvatarFallback>
                  {inquiry.userName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{inquiry.userName}</h3>
                <p className="text-sm text-muted-foreground">Customer</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{inquiry.userEmail}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{inquiry.userPhone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{inquiry.date}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Property Details</h4>
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium text-sm">{inquiry.propertyName}</p>
                  <p className="text-xs text-muted-foreground">{inquiry.propertyAddress}</p>
                  <p className="text-xs text-muted-foreground">ID: {inquiry.propertyId}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Status</p>
                {getStatusBadge(inquiry.status)}
              </div>
              <div>
                <p className="text-sm font-medium">Priority</p>
                {getPriorityBadge(inquiry.priority)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversation */}
        <Card className="admin-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Original Message */}
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {inquiry.userName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{inquiry.userName}</span>
                  <span className="text-xs text-muted-foreground">{inquiry.date}</span>
                </div>
                <p className="text-sm">{inquiry.message}</p>
              </div>

              {/* Responses */}
              {inquiry.responses.map((response, index) => (
                <div key={index} className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Admin Response</span>
                    <span className="text-xs text-muted-foreground">{response.date}</span>
                  </div>
                  <p className="text-sm">{response.message}</p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Reply Form */}
            <div className="space-y-4">
              <h4 className="font-medium">Send Response</h4>
              <Textarea
                placeholder="Type your response here..."
                rows={4}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button className="admin-button-primary">
                  <Send className="mr-2 h-4 w-4" />
                  Send Response
                </Button>
                <Button variant="outline">
                  Mark as Resolved
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}