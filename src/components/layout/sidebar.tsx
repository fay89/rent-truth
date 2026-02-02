"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    User,
    FileText,
    Star,
    ShieldCheck,
    Settings,
    LogOut,
    CheckCircle2
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";

export function DashboardSidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    if (!user) return null;

    const navItems = [
        { name: "Dashboard", href: `/dashboard/${user.role.toLowerCase()}`, icon: LayoutDashboard },
        { name: "Perfil", href: "/dashboard/profile", icon: User },
        { name: "Contratos", href: "/dashboard/contracts", icon: FileText },
        { name: "Reviews", href: "/dashboard/reviews", icon: Star },
        { name: "Verificación", href: "/dashboard/verification", icon: ShieldCheck },
        { name: "Ajustes", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <aside className={cn("w-64 bg-sidebar border-r border-sidebar-border flex-col text-sidebar-foreground", className)}>
            {/* Logo Area */}
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-sidebar-primary" />
                        <span className="text-xl font-bold bg-white bg-clip-text text-transparent">
                            RentTruth
                        </span>
                    </div>
                </Link>
                {/* Debug / User Info */}
                {/* User Info */}
                <div className="mt-6 flex flex-col items-center text-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 mb-2 border border-sidebar-primary/30">
                        {user.photoUrl ? (
                            <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User className="w-6 h-6 text-sidebar-foreground/50" />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1 justify-center w-full">
                        <p className="font-semibold text-sm truncate text-blue-100 max-w-[140px]">{user.name}</p>
                        {user.identityVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-green fill-brand-green/20" />
                        )}
                    </div>
                    <p className="text-xs text-sidebar-foreground/60 capitalize">{user.role === 'TENANT' ? 'Inquilino' : 'Propietario'}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-primary"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/70")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-sidebar-border">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
