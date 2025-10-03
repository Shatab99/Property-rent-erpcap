"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Signup() {
  const router = useRouter();
  return (
    <div className="bg-white">
      <section className="py-16">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join Rentora to find, tour, and apply faster.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const data = new FormData(form);
                const password = String(data.get("password"));
                const confirm = String(data.get("confirm"));
                // if (password !== confirm) {
                //   toast.error("Passwords do not match");
                //   return;
                // }
                const email = String(data.get("email"));
                const name = String(data.get("name"));
                localStorage.setItem("userEmail", email);
                localStorage.setItem(
                  "profile",
                  JSON.stringify({ name, email }),
                );
                window.dispatchEvent(new Event("auth-change"));
                toast.success("Account created. Welcome!");
                form.reset();
                router.push(`/otp/${email}`);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" placeholder="Jane Doe" required />
              </div>
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
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input id="confirm" name="confirm" type="password" required />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox required /> I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy
                </a>
              </label>
              <Button type="submit" className="w-full">
                Create account
              </Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
