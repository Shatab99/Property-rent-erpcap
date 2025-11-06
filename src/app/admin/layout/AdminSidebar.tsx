"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  Users,
  MessageSquare,
  Settings,
  UserPlus,
  UserCheck,
  MessageSquareCode,
  BadgeDollarSign,
  UserStar,
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
  SidebarProvider,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "../../../../public/logo.png";

const menuItems = [
  {
    title: "Overview",
    url: "/admin",
    icon: BarChart3,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Agent List",
    url: "/admin/agents",
    icon: UserCheck,
  },
  {
    title: "Landlord List",
    url: "/admin/landlords",
    icon: UserStar ,
  },
  {
    title: "Applications",
    url: "/admin/applications",
    icon: MessageSquareCode,
  },
  {
    title: "Offers from Customers",
    url: "/admin/offers",
    icon: BadgeDollarSign,
  },
  {
    title: "Inquiries",
    url: "/admin/inquiries",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Add Agent",
    url: "/admin/add-agent",
    icon: UserPlus,
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
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
              <h2 className="font-bold text-lg text-primary">PropAdmin</h2>
              <p className="text-xs text-sidebar-foreground/70">
                Property Management
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
