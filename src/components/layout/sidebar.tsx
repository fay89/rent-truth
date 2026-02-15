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
        <aside className={cn("w-72 bg-brand-blue flex flex-col text-white relative h-full shadow-2xl z-20 border-r border-white/5", className)}>
            {/* Brand Area */}
            <div className="p-8 pb-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-brand-green p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-brand-green/20">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity block font-heading">
                            RentTruth
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Security</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">Menú Principal</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-brand-green to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    );
                })}

                {/* Verification Card (Mini) */}
                {!user.identityVerified && (
                    <div className="mt-8 mx-2 p-5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group">
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3 text-yellow-400">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-wide">No Verificado</span>
                            </div>
                            <p className="text-xs text-slate-300 mb-4 leading-relaxed font-medium">
                                Aumenta tu confianza verificando tu identidad.
                            </p>
                            <Link href="/dashboard/verification" className="block w-full py-2.5 text-xs font-bold text-center bg-white text-brand-blue rounded-xl hover:bg-yellow-50 hover:text-yellow-900 transition-colors shadow-lg shadow-black/20">
                                Verificar ahora
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-white/5 bg-slate-900/40 backdrop-blur-md">
                <div className="flex items-center gap-3 p-2 mb-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border-2 border-slate-700 group-hover:border-slate-500 transition-colors">
                        {user.photoUrl ? (
                            <img src={user.photoUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            user.name.charAt(0)
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate group-hover:text-brand-green transition-colors">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border border-transparent hover:border-rose-500/20"
                >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                </button>
                <div className="mt-4 text-center text-[9px] text-slate-700 font-mono tracking-widest uppercase opacity-50">
                    RentTruth v{APP_VERSION}
                </div>
            </div>
        </aside>
    );
}
