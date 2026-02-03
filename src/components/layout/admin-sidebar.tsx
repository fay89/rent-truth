"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShieldCheck,
    Settings,
    LogOut,
    UserCog,
    CheckCircle2,
    FileText,
    Users
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { APP_VERSION } from "@/lib/version";

export function AdminSidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    if (!user) return null;

    const navItems = [
        { name: "Verificaciones", href: "/dashboard/admin", icon: ShieldCheck },
        { name: "Historial", href: "/dashboard/admin/history", icon: FileText },
        { name: "Usuarios", href: "/dashboard/admin/users", icon: Users },
    ];

    return (
        <aside className={cn("w-64 bg-sidebar border-r border-sidebar-border flex-col text-sidebar-foreground", className)}>
            {/* Logo Area */}
            <div className="p-6">
                <Link href="/dashboard/admin" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-red-500" />
                        <span className="text-xl font-bold bg-white bg-clip-text text-transparent">
                            RT Admin
                        </span>
                    </div>
                </Link>
                {/* User Info */}
                <div className="mt-6 flex flex-col items-center text-center p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                    <div className="flex items-center gap-1 justify-center w-full">
                        <p className="font-semibold text-sm truncate text-red-100 max-w-[140px]">{user.name}</p>
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                    </div>
                    <p className="text-xs text-red-200/60 uppercase tracking-wider font-bold mt-1">SUPER ADMIN</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard/settings' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-red-900/40 text-red-100 border border-red-500/30"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-red-400" : "text-sidebar-foreground/70")} />
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
                <div className="mt-4 px-3 text-xs text-neutral-500 font-mono">
                    {APP_VERSION} (Admin)
                </div>
            </div>
        </aside>
    );
}
