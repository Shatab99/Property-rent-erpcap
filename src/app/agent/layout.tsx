import { SidebarProvider } from "@/components/ui/sidebar";
import AgentHeader from "@/app/agent/layout/AgentHeader";
import AgentSidebar from "@/app/agent/layout/AgentSidebar";

interface AgentLayoutProps {
    children: React.ReactNode;
}

export default function layout({ children }: AgentLayoutProps) {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <AgentSidebar />
                <div className="flex-1 flex flex-col">
                    <AgentHeader />
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
