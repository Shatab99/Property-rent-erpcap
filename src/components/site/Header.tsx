import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Search" },
  { to: "/listings", label: "Listings" },
  { to: "/find-agent", label: "Find Agent" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { pathname } = useLocation();
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const sync = () => setEmail(localStorage.getItem("userEmail"));
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
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary " />
          <span className="font-extrabold tracking-tight text-xl text-primary">
            Rentora
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                  (isActive || pathname === item.to) && "text-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {email ? (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("userEmail");
                  window.dispatchEvent(new Event("auth-change"));
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
