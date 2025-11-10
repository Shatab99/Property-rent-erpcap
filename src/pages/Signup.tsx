"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/lib/toast";
import api from "@/lib/baseurl";
import { useState } from "react";
import { Loader } from "lucide-react";
import { Separator } from "@/components/ui/separator"

export default function Signup() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-white">
      <section className="py-16">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join Sk Real Estate to find, tour, and apply faster.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const form = e.currentTarget as HTMLFormElement;
                  const data = new FormData(form);
                  const password = String(data.get("password"));
                  const confirm = String(data.get("confirm"));
                  if (password.length < 8) return toastError("Password must be at least 8 characters long", { position: "bottom-center" });

                  if (password !== confirm) {
                    toastError("Passwords do not match", { position: "bottom-center" });
                    return;
                  }
                  const email = String(data.get("email"));
                  const name = String(data.get("name"));
                  const phone = String(data.get("phone"));

                  // Validate USA phone number format
                  const phoneRegex = /^\+?1?[-.\s]?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
                  if (!phoneRegex.test(phone)) {
                    toastError("Please enter a valid USA phone number (e.g., +12345678901 or (234) 567-8901)", { position: "bottom-center" });
                    return;
                  }

                  const res = await api.post("/users/create", { email, name, password, phone });

                  console.log(res)

                  if (!res.data.success) {
                    toastError(res.data.message || "Something went wrong", { position: "bottom-center" });
                    return;
                  }

                  window.dispatchEvent(new Event("auth-change"));
                  toastSuccess("Successfully signed up !", { position: "top-center" });
                  form.reset();
                  router.push(`/login`);
                }
                catch (error: any) {
                  toastError(error?.response?.data?.message || error.message || "Something went wrong", { position: "bottom-center" });
                  console.log(error)
                }
                finally {
                  setLoading(false);
                }
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
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+124-45-6789" name="phone" type="tel" required />
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
                {loading ? <Loader className="animate-spin" /> : "Create account"}
              </Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
            <Separator className="my-3" />
            <p className="mt-4 text-sm text-muted-foreground">
              Or sign up as a Vendor{" "}
              <Link
                href="/vendor"
                className="text-primary hover:underline"
              >
                click here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
