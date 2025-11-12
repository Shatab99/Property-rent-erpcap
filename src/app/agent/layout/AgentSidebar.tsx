"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  MessageSquare,
  Settings,
  CreditCard,
  User2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "../../../../public/logo.png";

const menuItems = [
  {
    title: "Overview",
    url: "/agent",
    icon: BarChart3,
  },
  {
    title: "Listings",
    url: "/agent/listings",
    icon: Building2,
  },
  {
    title: "Subscription Plans",
    url: "/agent/subscription-plans",
    icon: CreditCard,
  },
  {
    title:"Agent Profile",
    url: '/agent/profile',
    icon: User2,
  },
  {
    title: "Settings",
    url: "/agent/settings",
    icon: Settings,
  },
];

export default function AgentSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/agent") {
      return pathname === "/agent";
    }
    return pathname?.startsWith(path);
  };

  return (
    <Sidebar
      variant="sidebar"
      className="w-64 bg-sidebar border-r border-sidebar-border"
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Image
              height={100}
              width={100}
              src={logo}
              alt="Logo"
              className="rounded-md"
            />
            <div>
              <h2 className="font-bold text-lg text-primary">PropAgent</h2>
              <p className="text-xs text-sidebar-foreground/70">
                Agent Portal
              </p>
            </div>
          </div>
        </div>

        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-gray-600 font-bold mb-4">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 ">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.url)
                        ? "bg-sidebar-accent text-primary font-medium shadow-sm"
                        : "hover:bg-slate-200 hover:text-secondary"
                        }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
