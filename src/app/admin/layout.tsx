import { SidebarProvider } from "@/components/ui/sidebar";
import AdminHeader from "@/app/admin/layout/AdminHeader";
import AdminSidebar from "@/app/admin/layout/AdminSidebar";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function layout({ children }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <AdminSidebar />
                <div className="flex-1 flex flex-col">
                    <AdminHeader />
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}