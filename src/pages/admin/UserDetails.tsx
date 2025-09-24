import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Building2 } from "lucide-react";

const mockUserData = {
  "1": {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    role: "tenant",
    status: "active",
    dateJoined: "2024-01-15",
    avatar: null,
    address: "123 Main St, Downtown",
    lastActive: "2024-01-23",
    totalInquiries: 5,
    favoriteProperties: 12,
    listings: [],
    activity: [
      { action: "Viewed property listing", details: "Modern Downtown Apartment", date: "2024-01-23" },
      { action: "Sent inquiry", details: "Luxury Family House", date: "2024-01-22" },
      { action: "Added to favorites", details: "Commercial Office Space", date: "2024-01-20" },
    ]
  }
};

export default function UserDetails() {
  const id = "1";
  const router = useRouter();
  const user = mockUserData[id as keyof typeof mockUserData];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">User Not Found</h2>
          <p className="text-muted-foreground mt-2">The requested user could not be found.</p>
          <Button onClick={() => router.push("/admin/users")} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "agent":
        return <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-full text-xs font-medium">Agent</span>;
      case "landlord":
        return <span className="bg-accent/10 text-accent border border-accent/20 px-2 py-1 rounded-full text-xs font-medium">Landlord</span>;
      case "tenant":
        return <span className="bg-secondary text-secondary-foreground border border-border px-2 py-1 rounded-full text-xs font-medium">Tenant</span>;
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
          onClick={() => router.push("/admin/users")}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Details</h1>
          <p className="text-muted-foreground mt-2">
            Detailed information about {user.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <Card className="admin-card lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                <AvatarFallback className="text-xl">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <div className="mt-2">{getRoleBadge(user.role)}</div>
              <span className={user.status === "active" ? "status-active" : "status-inactive"}>
                {user.status}
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {user.dateJoined}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="admin-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.totalInquiries}</div>
                <div className="text-sm text-muted-foreground">Total Inquiries</div>
              </CardContent>
            </Card>
            <Card className="admin-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent">{user.favoriteProperties}</div>
                <div className="text-sm text-muted-foreground">Favorite Properties</div>
              </CardContent>
            </Card>
            <Card className="admin-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-success">{user.listings.length}</div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.activity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}