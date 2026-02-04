"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShieldCheck,
    Settings,
    LogOut,
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
        { name: "Vista General", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Contratos", href: "/dashboard/admin/history", icon: FileText },
        { name: "Usuarios", href: "/dashboard/admin/users", icon: Users },
        { name: "Configuración", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <aside className={cn("w-72 bg-[#1A1010] flex flex-col text-white relative h-full shadow-2xl z-20 border-r border-red-900/20", className)}>
            {/* Brand Area */}
            <div className="p-8 pb-6">
                <Link href="/dashboard/admin" className="flex items-center gap-3 group">
                    <div className="bg-red-600 p-1.5 rounded-lg shadow-lg shadow-red-900/50 group-hover:bg-red-500 transition-colors">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="text-lg font-bold tracking-tight text-white block leading-none">
                            RentTruth
                        </span>
                        <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase">
                            Admin Panel
                        </span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1.5">
                <p className="px-4 text-xs font-semibold text-red-100/30 uppercase tracking-wider mb-2 mt-2">Gestión</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard/settings' && pathname.startsWith(item.href) && item.href !== '/dashboard/admin');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-red-600/10 text-red-100 border border-red-500/20 shadow-inner"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-red-500" : "text-zinc-500 group-hover:text-white")} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-3 p-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-red-900/20 flex items-center justify-center text-red-500 font-bold border border-red-500/30">
                        {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-red-500" />
                            <span className="text-[10px] text-red-400 font-semibold tracking-wide">ADMINISTRADOR</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
