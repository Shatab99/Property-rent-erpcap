"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function AgentHeader() {
  const router = useRouter();
  const agentName = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('name='))?.split('=')[1] || 'Agent' : 'Agent';
  const agentEmail = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('email='))?.split('=')[1] || 'agent@example.com' : 'agent@example.com';

  return (
    <header className="h-16 bg-white border-b border-border shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4 ">
        <SidebarTrigger />

        <div className="flex items-center admin-search w-96">
          <Search className="w-4 h-4 text-muted-foreground ml-3 absolute" />
          <Input
            placeholder="Search listings, inquiries..."
            className="border-0 focus:ring-0 focus:outline-none pl-10 relative"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs text-primary-foreground font-medium">2</span>
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/agent-avatar.jpg" alt="Agent" />
                <AvatarFallback className="bg-primary text-primary-foreground">AG</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{agentName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {agentEmail}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              document.cookie = "token=; path=/; max-age=0";
              document.cookie = "email=; path=/; max-age=0";
              document.cookie = "name=; path=/; max-age=0";
              document.cookie = "role=; path=/; max-age=0";
              window.dispatchEvent(new Event("auth-change"));
              router.push("/login");
            }} className="text-destructive">
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
