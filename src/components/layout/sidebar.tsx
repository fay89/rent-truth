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
import { APP_VERSION } from "@/lib/version";

export function DashboardSidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    if (!user) return null;

    const navItems = [
        { name: "Inicio", href: `/dashboard/${user.role.toLowerCase()}`, icon: LayoutDashboard },
        { name: "Mi Perfil", href: "/dashboard/profile", icon: User },
        { name: "Contratos", href: "/dashboard/contracts", icon: FileText },
        { name: "Reseñas", href: "/dashboard/reviews", icon: Star },
        { name: "Verificación", href: "/dashboard/verification", icon: ShieldCheck },
        { name: "Ajustes", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <aside className={cn("w-72 bg-[#0F172A] flex flex-col text-white relative h-full shadow-2xl z-20", className)}>
            {/* Brand Area */}
            <div className="p-8 pb-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-brand-green p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity">
                        RentTruth
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Menú Principal</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-brand-green text-white shadow-lg shadow-brand-green/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                            <span className="relative z-10">{item.name}</span>
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                            )}
                        </Link>
                    );
                })}

                {/* Verification Card (Mini) */}
                {!user.identityVerified && (
                    <div className="mt-8 mx-2 p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2 text-yellow-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">No Verificado</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                            Verifica tu identidad para aumentar la confianza en tu perfil.
                        </p>
                        <Link href="/dashboard/verification" className="block w-full py-2 text-xs font-bold text-center bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
                            Verificar ahora
                        </Link>
                    </div>
                )}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3 p-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                        {user.photoUrl ? (
                            <img src={user.photoUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            user.name.charAt(0)
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border border-transparent hover:border-rose-500/20"
                >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                </button>
                <div className="mt-3 text-center text-[10px] text-slate-600 font-mono">
                    Ver. {APP_VERSION}
                </div>
            </div>
        </aside>
    );
}
