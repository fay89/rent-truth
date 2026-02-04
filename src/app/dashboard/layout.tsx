"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) {
        return null;
    }

    if (user.role === 'ADMIN') {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-neutral-50/50 w-full overflow-hidden">
            {/* Desktop Sidebar */}
            <DashboardSidebar className="hidden md:flex shrink-0" />

            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out w-full overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-brand-blue">RentTruth</span>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="-mr-2">
                                <Menu className="h-6 w-6 text-brand-blue" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-brand-blue text-white w-72 border-r-0">
                            <SheetTitle className="hidden">Menú</SheetTitle>
                            <DashboardSidebar className="flex w-full h-full border-none" />
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Top Bar (Desktop) */}
                <header className="hidden md:flex items-center justify-between px-8 py-5 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
                    <div>
                        <h1 className="text-xl font-bold text-brand-blue tracking-tight">
                            Hola, {user.name.split(' ')[0]} 👋
                        </h1>
                        <p className="text-sm text-neutral-500 font-medium">
                            {user.role === 'TENANT' ? 'Panel de Inquilino' : 'Panel de Propietario'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-brand-blue hover:bg-blue-50 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </Button>
                        <div className="h-8 w-px bg-neutral-200 mx-1"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-blue to-blue-900 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 ring-2 ring-white cursor-pointer hover:scale-105 transition-transform">
                                {user.photoUrl ? (
                                    <img src={user.photoUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    user.name.charAt(0)
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8 pb-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
