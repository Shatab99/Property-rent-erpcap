import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sk Real Estate - Find Your Perfect Home",
  description: "Discover and rent high-quality properties. Browse listings, connect with agents, and apply for your ideal rental home.",
  keywords: "rental properties, apartments, houses for rent, property listings",
  authors: [{ name: "Sk Real Estate" }],
  creator: "Sk Real Estate Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skrealestate.com",
    title: "Sk Real Estate - Find Your Perfect Home",
    description: "Discover and rent high-quality properties",
    siteName: "Sk Real Estate",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster  />
      </body>
    </html>
  );
}
