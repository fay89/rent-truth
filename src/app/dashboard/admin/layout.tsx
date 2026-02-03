"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        } else if (user && user.role !== 'ADMIN') {
            // Kick out non-admins
            router.push(`/dashboard/${user.role.toLowerCase()}`);
        }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || !user || user.role !== 'ADMIN') {
        return null;
    }

    return (
        <div className="flex h-screen bg-neutral-50 overflow-x-hidden w-full max-w-full dark:bg-neutral-900">
            {/* Desktop Sidebar */}
            <AdminSidebar className="hidden md:flex" />

            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out w-full max-w-full overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-20 w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-red-600">RT Admin</span>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6 text-neutral-700 dark:text-white" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-sidebar text-white w-64 border-r-0">
                            <SheetTitle className="hidden">Menú Admin</SheetTitle>
                            <AdminSidebar className="flex w-full h-full" />
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 p-3 md:p-6 overflow-auto bg-neutral-100 dark:bg-neutral-900 w-full max-w-full overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
