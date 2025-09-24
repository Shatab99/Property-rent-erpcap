"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  return (
    <div className="bg-white">
      <section className="py-16">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight">Log in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back. Enter your credentials to continue.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const data = new FormData(form);
                const email = String(data.get("email"));
                document.cookie = `token=${email}; path=/`;
                window.dispatchEvent(new Event("auth-change"));
                toast.success(`Logged in as ${email}`);
                const next = new URLSearchParams(window.location.search).get(
                  "next",
                );
                form.reset();
                router.push(next || "/");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <Checkbox /> Remember me
                </label>
                <Link href="#" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full">
                Log in
              </Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
