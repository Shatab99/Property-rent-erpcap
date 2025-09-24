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

type Profile = {
  name: string;
  email: string;
  address?: string;
  phone?: string;
  about?: string;
  employment?: string;
  householdSize?: number;
  moveIn?: string; // ISO date
  creditScore?: number;
};
type Prefs = { targetCity?: string; maxBudget?: number; minBeds?: number; pets?: "none" | "cats" | "dogs" | "both" };
type Collaborator = { email: string; status: "invited" | "accepted"; role: "buyer" | "cosigner" | "agent"; message?: string };

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      return JSON.parse(localStorage.getItem("profile") || "{}");
    } catch {
      return {};
    }
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
  const [contactedIds, setContactedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("contacted") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // Seed dummy data if absent
    try {
      const existingProfile = localStorage.getItem("profile");
      if (!existingProfile) {
        const seeded: Profile = {
          name: "Jordan Lee",
          email: localStorage.getItem("userEmail") || "jordan@example.com",
          phone: "(415) 555-0142",
          address: "245 Market St, San Francisco, CA",
          about: "Product manager relocating for a new role. Quiet, tidy, and reliable tenant with excellent references.",
          employment: "Full-time at Acme Inc. (4+ years)",
          householdSize: 2,
          moveIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
          creditScore: 760,
        };
        localStorage.setItem("profile", JSON.stringify(seeded));
        setProfile(seeded);
      }
      const existingPrefs = localStorage.getItem("preferences");
      if (!existingPrefs) {
        const seededPrefs: Prefs = { targetCity: "San Francisco, CA", maxBudget: 3800, minBeds: 1, pets: "cats" };
        localStorage.setItem("preferences", JSON.stringify(seededPrefs));
        setPrefs(seededPrefs);
      }
      const contactedRaw = localStorage.getItem("contacted");
      if (!contactedRaw || contactedRaw === "[]") {
        const seededContacted = ["p1", "p3"];
        localStorage.setItem("contacted", JSON.stringify(seededContacted));
        setContactedIds(seededContacted);
      }
    } catch { }
  }, []);

  useEffect(() => {
    const onChange = () =>
      setContactedIds(() => {
        try {
          return JSON.parse(localStorage.getItem("contacted") || "[]");
        } catch {
          return [];
        }
      });
    window.addEventListener("contacted-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("contacted-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

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
              <TabsList>
                <TabsTrigger value="profile">Buyer profile</TabsTrigger>
                <TabsTrigger value="contacted">Contacted rentals</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="collab">Collaborate</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">Buyer profile</h2>
                    <div className="mt-4 grid gap-3 text-sm">
                      <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{profile.name || "—"}</span></div>
                      <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{profile.email }</span></div>
                      <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{profile.phone || "—"}</span></div>
                      <div><span className="text-muted-foreground">Address:</span> <span className="font-medium">{profile.address || "—"}</span></div>
                      <div><span className="text-muted-foreground">Employment:</span> <span className="font-medium">{profile.employment || "—"}</span></div>
                      <div><span className="text-muted-foreground">Household size:</span> <span className="font-medium">{profile.householdSize ?? "—"}</span></div>
                      <div><span className="text-muted-foreground">Move-in:</span> <span className="font-medium">{profile.moveIn || "—"}</span></div>
                      <div><span className="text-muted-foreground">Credit score:</span> <span className="font-medium">{profile.creditScore ?? "—"}</span></div>
                      <div className="pt-2"><span className="text-muted-foreground">About:</span><p className="mt-1 text-foreground">{profile.about || "—"}</p></div>
                    </div>
                  </div>
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">
                      Buying preferences
                    </h2>
                    <form
                      className="mt-4 grid gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        localStorage.setItem(
                          "preferences",
                          JSON.stringify(prefs),
                        );
                        toast.success("Preferences saved");
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="targetCity">Target city</Label>
                        <Input
                          id="targetCity"
                          value={prefs.targetCity || ""}
                          onChange={(e) =>
                            setPrefs({ ...prefs, targetCity: e.target.value })
                          }
                          placeholder="City or neighborhood"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxBudget">
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
                        />
                      </div>
                      <div className="pt-2">
                        <Button type="submit">Save preferences</Button>
                      </div>
                    </form>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contacted" className="mt-6">
                {contacted.length === 0 ? (
                  <div className="rounded-xl border bg-white p-6 text-center text-muted-foreground">
                    You {`haven't`} contacted any rentals yet.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {contacted.map((p) => (
                      <div key={p.id} className="relative">
                        <PropertyRow property={p} />
                        <div className="absolute right-4 top-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const next = contactedIds.filter(
                                (id) => id !== p.id,
                              );
                              setContactedIds(next);
                              localStorage.setItem(
                                "contacted",
                                JSON.stringify(next),
                              );
                              window.dispatchEvent(
                                new Event("contacted-change"),
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">Profile settings</h2>
                    <form
                      className="mt-4 grid gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        localStorage.setItem(
                          "profile",
                          JSON.stringify(profile),
                        );
                        toast.success("Profile updated");
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={profile.name || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={
                            profile.email
                          }
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={profile.address || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, address: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input
                          id="phone"
                          value={profile.phone || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="pt-2">
                        <Button type="submit">Save changes</Button>
                      </div>
                    </form>
                  </div>
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">Reset password</h2>
                    <form
                      className="mt-4 grid gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        toast.success("Password reset link sent to your email");
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="pwd-email">Email</Label>
                        <Input
                          id="pwd-email"
                          type="email"
                          defaultValue={
                            profile.email
                          }
                          required
                        />
                      </div>
                      <div className="pt-2">
                        <Button type="submit">Send reset link</Button>
                      </div>
                    </form>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="collab" className="mt-6">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Collaborate</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Invite someone to search and apply together.</p>
                    </div>
                    <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                      <DialogTrigger asChild>
                        <Button>Invite collaborator</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invite a collaborator</DialogTitle>
                          <DialogDescription>Send an invitation to collaborate on your rental search.</DialogDescription>
                        </DialogHeader>
                        <form className="mt-4 grid gap-3" onSubmit={(e) => {
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
                          <div className="space-y-2">
                            <Label htmlFor="invite-email">Email</Label>
                            <Input id="invite-email" name="email" type="email" placeholder="teammate@example.com" required />
                          </div>
                          <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Collaborator["role"])}>
                              <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="buyer">Buyer/Renter</SelectItem>
                                <SelectItem value="cosigner">Co-signer</SelectItem>
                                <SelectItem value="agent">Agent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="invite-message">Message</Label>
                            <Textarea id="invite-message" name="message" placeholder="Add a note (optional)" />
                          </div>
                          <div className="pt-2"><Button type="submit">Send invite</Button></div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm">
                    {collabs.length === 0 ? (
                      <div className="text-muted-foreground">No collaborators yet.</div>
                    ) : (
                      collabs.map((c, i) => (
                        <div key={i} className="flex items-center justify-between rounded-md border p-3">
                          <div>
                            <div className="font-medium">{c.email}</div>
                            <div className="text-xs text-muted-foreground">Role: {c.role} • Status: {c.status}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {c.status === "invited" && (
                              <Button size="sm" variant="outline" onClick={() => {
                                const next = [...collabs];
                                next[i] = { ...next[i], status: "accepted" };
                                setCollabs(next);
                                localStorage.setItem("collaborators", JSON.stringify(next));
                              }}>Mark accepted</Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => {
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
