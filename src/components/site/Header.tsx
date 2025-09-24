"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Search" },
  { to: "/listings", label: "Listings" },
  { to: "/findAgent", label: "Find Agent" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    const sync = () => setEmail(document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null);
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("auth-change", sync as any);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-change", sync as any);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary" />
          <span className="font-extrabold tracking-tight text-xl text-primary">
            Rentora
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                pathname === item.to && "text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          {email ? (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  document.cookie = "token=; path=/; max-age=0";
                  window.dispatchEvent(new Event("auth-change"));
                  router.push("/login");
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
