import { SidebarProvider } from "@/components/ui/sidebar";
import LandlordHeader from "@/app/landlord/layout/LandlordHeader";
import LandlordSidebar from "@/app/landlord/layout/LandlordSidebar";

interface LandlordLayoutProps {
    children: React.ReactNode;
}

export default function layout({ children }: LandlordLayoutProps) {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <LandlordSidebar />
                <div className="flex-1 flex flex-col">
                    <LandlordHeader />
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
