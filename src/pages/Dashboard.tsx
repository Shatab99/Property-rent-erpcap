'use client';
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { properties } from "@/data/properties";
import PropertyRow from "@/components/site/PropertyRow";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/baseurl";
import { Loader } from "lucide-react";

type Profile = {
  name: string;
  email: string;
  address?: string;
  phone?: string;
  bio?: string;
  employment?: string;
  creditScore?: number;
};
type Prefs = { targetCity?: string; maxBudget?: number; minBeds?: number; pets?: "none" | "cats" | "dogs" | "both" };
type Collaborator = { email: string; status: "invited" | "accepted"; role: "buyer" | "cosigner" | "agent"; message?: string };
type FavoriteProperty = {
  id: string;
  listingKey: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
};

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
  });

  const router = useRouter();
  const token = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null;

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token, router]);

  const [prefs, setPrefs] = useState<Prefs>(() => {
    try {
      return JSON.parse(localStorage.getItem("preferences") || "{}");
    } catch {
      return {};
    }
  });
  const [collabs, setCollabs] = useState<Collaborator[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("collaborators") || "[]");
    } catch {
      return [];
    }
  });
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState<Collaborator["role"]>("buyer");
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [contactedIds, setContactedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("contacted") || "[]");
    } catch {
      return [];
    }
  });

  const fetchProfile = async () => {
    const res = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setProfile(res.data.data);
  }

  const fetchFavorites = async () => {
    setLoadingFavorites(true);
    try {
      const res = await api.get("/users/favorite", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        setFavorites(res.data.data || []);
      }
    } catch (error: any) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorite properties");
    } finally {
      setLoadingFavorites(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchFavorites();
    }
  }, [token]);

  useEffect(() => {
    const onChange = () => {
      if (token) {
        fetchFavorites();
      }
    };
    window.addEventListener("favorites-change", onChange);
    return () => {
      window.removeEventListener("favorites-change", onChange);
    };
  }, [token]);

  const contacted = useMemo(
    () => properties.filter((p) => contactedIds.includes(p.id)),
    [contactedIds],
  );

  return (
    <div className="bg-white">
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your profile, track contacted rentals, and collaborate.
          </p>

          <div className="mt-6">
            <Tabs defaultValue="profile">
              <TabsList className="w-full md:w-auto flex-wrap md:flex-nowrap gap-2 md:gap-0 h-auto md:h-10">
                <TabsTrigger value="profile" className="text-xs sm:text-sm">Buyer profile</TabsTrigger>
                <TabsTrigger value="contacted" className="text-xs sm:text-sm">Favourite Properties</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
                <TabsTrigger value="collab" className="text-xs sm:text-sm">Collaborate</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-4 sm:mt-6">
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                  <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm">
                    <h2 className="text-base sm:text-lg font-semibold">Buyer profile</h2>
                    <div className="mt-3 sm:mt-4 grid gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between"><span className="text-muted-foreground">Name:</span> <span className="font-medium">{profile.name || "—"}</span></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between"><span className="text-muted-foreground">Email:</span> <span className="font-medium break-all">{profile.email}</span></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between"><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{profile.phone || "—"}</span></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between"><span className="text-muted-foreground">Address:</span> <span className="font-medium">{profile.address || "—"}</span></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between"><span className="text-muted-foreground">Employment:</span> <span className="font-medium">{profile.employment || "—"}</span></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between"><span className="text-muted-foreground">Credit score:</span> <span className="font-medium">{profile.creditScore ?? "—"}</span></div>
                      <div className="pt-2"><span className="text-muted-foreground">About:</span><p className="mt-1 text-foreground text-xs sm:text-sm">{profile.bio || "—"}</p></div>
                    </div>
                  </div>
                  <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm">
                    <h2 className="text-base sm:text-lg font-semibold">
                      Buying preferences
                    </h2>
                    <form
                      className="mt-3 sm:mt-4 grid gap-2 sm:gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        localStorage.setItem(
                          "preferences",
                          JSON.stringify(prefs),
                        );
                        toast.success("Preferences saved");
                      }}
                    >
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="targetCity" className="text-xs sm:text-sm">Target city</Label>
                        <Input
                          id="targetCity"
                          value={prefs.targetCity || ""}
                          onChange={(e) =>
                            setPrefs({ ...prefs, targetCity: e.target.value })
                          }
                          placeholder="City or neighborhood"
                          className="h-9 sm:h-10 text-xs sm:text-sm"
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="maxBudget" className="text-xs sm:text-sm">
                          Max monthly budget ($)
                        </Label>
                        <Input
                          id="maxBudget"
                          type="number"
                          min={0}
                          value={prefs.maxBudget ?? ""}
                          onChange={(e) =>
                            setPrefs({
                              ...prefs,
                              maxBudget: Number(e.target.value),
                            })
                          }
                          className="h-9 sm:h-10 text-xs sm:text-sm"
                        />
                      </div>
                      <div className="pt-2">
                        <Button type="submit" className="w-full sm:w-auto text-xs sm:text-sm">Save preferences</Button>
                      </div>
                    </form>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contacted" className="mt-4 sm:mt-6">
                {loadingFavorites ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 text-center shadow-lg">
                    <Loader className="h-10 w-10 animate-spin mx-auto text-blue-500" />
                    <p className="mt-3 text-sm sm:text-base text-muted-foreground font-medium">Loading favorite properties...</p>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 sm:p-12 text-center shadow-lg">
                    <div className="text-4xl mb-3">❤️</div>
                    <p className="text-base sm:text-lg text-muted-foreground font-medium">No favorite properties yet</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">Start adding properties to your favorites to see them here</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-300 bg-white overflow-hidden flex flex-col shadow-xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                      <p className="text-sm sm:text-base font-semibold text-foreground">
                        ⭐ {favorites.length} Favorite {favorites.length === 1 ? 'Property' : 'Properties'}
                      </p>
                    </div>

                    {/* Scrollable Content */}
                    <div className="h-[600px] sm:h-[700px] lg:h-[800px] overflow-y-auto">
                      <div className="grid gap-4 p-4 sm:p-6">
                        {favorites.map((property, idx) => (
                          <div
                            key={`${property.listingKey}-${idx}`}
                            className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-lg transition-all duration-300 hover:border-gray-300 bg-gradient-to-br from-white to-gray-50 group"
                          >
                            {/* Property Header */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm sm:text-base line-clamp-2 text-foreground group-hover:text-blue-600 transition-colors">
                                  {property.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 line-clamp-1 flex items-center gap-1">
                                  📍 {property.location}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="font-bold text-base sm:text-lg text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                                  ${property.price.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Property Details Grid */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 text-center hover:shadow-md transition-all">
                                <p className="font-bold text-sm sm:text-base text-blue-700">{property.bedrooms}</p>
                                <p className="text-xs text-blue-600 font-medium mt-0.5">Beds</p>
                              </div>
                              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 text-center hover:shadow-md transition-all">
                                <p className="font-bold text-sm sm:text-base text-purple-700">{property.bathrooms}</p>
                                <p className="text-xs text-purple-600 font-medium mt-0.5">Baths</p>
                              </div>
                              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 text-center hover:shadow-md transition-all">
                                <p className="font-bold text-sm sm:text-base text-amber-700">{(property.area / 1000).toFixed(1)}k</p>
                                <p className="text-xs text-amber-600 font-medium mt-0.5">sqft</p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-3 border-t border-gray-200">
                              <Button
                                asChild
                                className="flex-1 sm:flex-1 lg:flex-auto bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-8 sm:h-9 rounded-lg transition-all"
                              >
                                <Link href={`/property/${property.listingKey}`}>
                                  View Details
                                </Link>
                              </Button>
                              <Button
                                onClick={() => {
                                  // Call API to remove from favorites
                                  api.delete(`/users/favorite/${property.id}`, {
                                    headers: {
                                      Authorization: `Bearer ${token}`
                                    }
                                  }).then(() => {
                                    setFavorites(favorites.filter((_, i) => i !== idx));
                                    toast.success("Removed from favorites");
                                    window.dispatchEvent(new Event("favorites-change"));
                                  }).catch(() => {
                                    toast.error("Failed to remove favorite");
                                  });
                                }}
                                variant="outline"
                                className="px-3 sm:px-4 lg:px-5 text-xs sm:text-sm h-8 sm:h-9 border-red-200 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="settings" className="mt-4 sm:mt-6">
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                  <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm">
                    <h2 className="text-base sm:text-lg font-semibold">Profile settings</h2>
                    <form
                      className="mt-3 sm:mt-4 grid gap-2 sm:gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        localStorage.setItem(
                          "profile",
                          JSON.stringify(profile),
                        );
                        toast.success("Profile updated");
                      }}
                    >
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="name" className="text-xs sm:text-sm">Name</Label>
                        <Input
                          id="name"
                          value={profile.name || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
                          className="h-9 sm:h-10 text-xs sm:text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={
                            profile.email
                          }
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          className="h-9 sm:h-10 text-xs sm:text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="address" className="text-xs sm:text-sm">Address</Label>
                        <Input
                          id="address"
                          value={profile.address || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, address: e.target.value })
                          }
                          className="h-9 sm:h-10 text-xs sm:text-sm"
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="phone" className="text-xs sm:text-sm">Phone number</Label>
                        <Input
                          id="phone"
                          value={profile.phone || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          className="h-9 sm:h-10 text-xs sm:text-sm"
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="employment" className="text-xs sm:text-sm">Employment</Label>
                        <Input
                          id="employment"
                          value={profile.employment || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, employment: e.target.value })
                          }
                          className="h-9 sm:h-10 text-xs sm:text-sm"
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="bio" className="text-xs sm:text-sm">About</Label>
                        <Input
                          id="bio"
                          value={profile.bio || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                          }
                          className="h-9 sm:h-10 text-xs sm:text-sm"
                        />
                      </div>
                      <div className="pt-2">
                        <Button type="submit" className="w-full sm:w-auto text-xs sm:text-sm">Save changes</Button>
                      </div>
                    </form>
                  </div>
                  <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm">
                    <h2 className="text-base sm:text-lg font-semibold">Reset password</h2>
                    <form
                      className="mt-3 sm:mt-4 grid gap-2 sm:gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        toast.success("Password reset link sent to your email");
                      }}
                    >
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="pwd-email" className="text-xs sm:text-sm">Email</Label>
                        <Input
                          id="pwd-email"
                          type="email"
                          defaultValue={
                            profile.email
                          }
                          disabled
                          className="h-9 sm:h-10 text-xs sm:text-sm"
                        />
                      </div>
                      <div className="pt-2">
                        <Button type="submit" className="w-full sm:w-auto text-xs sm:text-sm">Send reset link</Button>
                      </div>
                    </form>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="collab" className="mt-4 sm:mt-6">
                <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold">Collaborate</h2>
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Invite someone to search and apply together.</p>
                    </div>
                    <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto text-xs sm:text-sm">Invite collaborator</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="text-base sm:text-lg">Invite a collaborator</DialogTitle>
                          <DialogDescription className="text-xs sm:text-sm">Send an invitation to collaborate on your rental search.</DialogDescription>
                        </DialogHeader>
                        <form className="mt-4 grid gap-2 sm:gap-3" onSubmit={(e) => {
                          e.preventDefault();
                          const data = new FormData(e.currentTarget as HTMLFormElement);
                          const email = String(data.get("email"));
                          const role = inviteRole;
                          const message = String(data.get("message") || "");
                          if (!email || !role) return;
                          const newCollab: Collaborator = { email, status: "invited", role, message };
                          const next = [...collabs, newCollab];
                          setCollabs(next);
                          localStorage.setItem("collaborators", JSON.stringify(next));
                          setInviteOpen(false);
                          toast.success("Invitation sent");
                        }}>
                          <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="invite-email" className="text-xs sm:text-sm">Email</Label>
                            <Input id="invite-email" name="email" type="email" placeholder="teammate@example.com" className="h-9 sm:h-10 text-xs sm:text-sm" required />
                          </div>
                          <div className="space-y-1 sm:space-y-2">
                            <Label className="text-xs sm:text-sm">Role</Label>
                            <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Collaborator["role"])}>
                              <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm"><SelectValue placeholder="Select role" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="buyer">Buyer/Renter</SelectItem>
                                <SelectItem value="cosigner">Co-signer</SelectItem>
                                <SelectItem value="agent">Agent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="invite-message" className="text-xs sm:text-sm">Message</Label>
                            <Textarea id="invite-message" name="message" placeholder="Add a note (optional)" className="text-xs sm:text-sm" />
                          </div>
                          <div className="pt-2"><Button type="submit" className="w-full text-xs sm:text-sm">Send invite</Button></div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="mt-4 grid gap-2 text-xs sm:text-sm">
                    {collabs.length === 0 ? (
                      <div className="text-muted-foreground text-xs">No collaborators yet.</div>
                    ) : (
                      collabs.map((c, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 rounded-md border p-2 sm:p-3">
                          <div className="min-w-0">
                            <div className="font-medium text-xs sm:text-sm break-all">{c.email}</div>
                            <div className="text-xs text-muted-foreground">Role: {c.role} • Status: {c.status}</div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            {c.status === "invited" && (
                              <Button size="sm" variant="outline" className="text-xs" onClick={() => {
                                const next = [...collabs];
                                next[i] = { ...next[i], status: "accepted" };
                                setCollabs(next);
                                localStorage.setItem("collaborators", JSON.stringify(next));
                              }}>Mark accepted</Button>
                            )}
                            <Button size="sm" variant="destructive" className="text-xs" onClick={() => {
                              const next = collabs.filter((_, idx) => idx !== i);
                              setCollabs(next);
                              localStorage.setItem("collaborators", JSON.stringify(next));
                            }}>Remove</Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
