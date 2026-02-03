"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { Menu } from "lucide-react";
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

    // Si es ADMIN, delegamos el layout al layout específico de admin (src/app/dashboard/admin/layout.tsx)
    // para evitar doble sidebar header o menús incorrectos en móvil.
    if (user.role === 'ADMIN') {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-neutral-50 overflow-x-hidden w-full max-w-full dark:bg-neutral-900">
            {/* Desktop Sidebar */}
            <DashboardSidebar className="hidden md:flex" />

            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out w-full max-w-full overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-20 w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-brand-blue dark:text-white">RentTruth</span>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6 text-brand-blue dark:text-white" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-brand-blue text-white w-64 border-r-0">
                            <SheetTitle className="hidden">Menú de Navegación</SheetTitle>
                            <DashboardSidebar className="flex w-full h-full" />
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Top Bar (Desktop) - Optional, can be part of page or a shared top bar */}
                <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-10 text-brand-blue w-full">
                    <h1 className="text-xl font-semibold">
                        Bienvenido, {user.name}
                    </h1>
                    <div className="flex items-center gap-4">
                        {/* Logout button moved to sidebar, but kept here for access or profile actions */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs text-neutral-500">{user.role === 'TENANT' ? 'Inquilino' : 'Propietario'}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-brand-green flex items-center justify-center text-white font-bold shadow-sm">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-3 md:p-6 overflow-auto bg-brand-light-gray dark:bg-neutral-900 w-full max-w-full overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
