"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, FileText, Shield, ArrowUpRight, Plus, Star, Users, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ShareReputationDialog } from "@/components/share-reputation-dialog";
import { cn } from "@/lib/utils";

export default function LandlordDashboard() {
    const { user } = useAuth();
    const { getContractsByLandlord, reviews } = useData();

    if (!user) return null;

    const contracts = getContractsByLandlord(user.email);
    const pendingContracts = contracts.filter(c => c.status === "PENDING" || c.status === "VERIFIED");
    const activeContracts = contracts.filter(c => c.status === "ACTIVE").length;

    // Metrics
    const myReviews = reviews.filter(r => r.targetId === user.email);
    const rating = myReviews.length > 0
        ? (myReviews.reduce((acc, r) => acc + r.rating, 0) / myReviews.length).toFixed(1)
        : "N/A";

    const hasProfile = user.identityVerified;
    const hasContract = contracts.length > 0;
    const hasReview = myReviews.length > 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero / Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Portfolio Value / Identity - Hero Card */}
                <div className="md:col-span-1 bg-[#1e293b] rounded-3xl p-8 text-white shadow-2xl shadow-slate-900/10 relative overflow-hidden group border border-slate-700/50">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-brand-green/10 rounded-full blur-3xl group-hover:bg-brand-green/20 transition-colors"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                <Building2 className="w-5 h-5" />
                                <span className="font-semibold tracking-wide text-sm uppercase">Mis Propiedades</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-extrabold tracking-tighter">{contracts.length}</span>
                                <span className="text-xl text-slate-500">Total</span>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <div className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 border border-slate-700">
                                    {activeContracts} Activos
                                </div>
                                <div className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 border border-slate-700">
                                    {pendingContracts.length} Pendientes
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <Link href="/dashboard/contracts/new">
                                <Button className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold shadow-lg shadow-brand-green/20">
                                    <Plus className="w-4 h-4 mr-2" /> Nuevo Contrato
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Score & Quick Stats */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Reputation Card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-brand-blue/20 transition-all">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-yellow-50 text-yellow-600 p-2.5 rounded-xl">
                                        <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                        {user.photoUrl ? (
                                            <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-slate-600 font-bold">{user.name.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-slate-800">{rating}</div>
                            </div>
                            <h3 className="font-bold text-lg text-slate-800">Reputación</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                Tienes {myReviews.length} reseñas verificadas. Mantén un buen trato para mejorar tu score.
                            </p>
                        </div>
                        <div className="mt-4">
                            <ShareReputationDialog />
                        </div>
                    </div>

                    {/* Verification / Trust */}
                    <div className={cn("p-6 rounded-3xl border transition-all h-full flex flex-col justify-between", hasProfile ? "bg-white border-slate-100 shadow-sm" : "bg-red-50 border-red-100")}>
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-2.5 rounded-xl", hasProfile ? "bg-brand-blue/5 text-brand-blue" : "bg-red-100 text-red-500")}>
                                    <Shield className="w-6 h-6" />
                                </div>
                                {!hasProfile && <Badge variant="destructive" className="rounded-full">Vital para ti</Badge>}
                            </div>
                            <h3 className="font-bold text-lg text-slate-800">Identidad {hasProfile ? "Verificada" : "Pendiente"}</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                {hasProfile ? "Tu identidad verificada te protege de fraudes y atrae mejores inquilinos." : "Verifica tu identidad para dar seguridad a tus inquilinos y evitar problemas."}
                            </p>
                        </div>
                        {!hasProfile && (
                            <Link href="/dashboard/verification" className="mt-4 inline-block">
                                <Button size="sm" variant="destructive" className="w-full rounded-xl">Verificar Ahora</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Mis Contratos & Propiedades</h2>
                        <Link href="/dashboard/contracts" className="text-sm font-semibold text-brand-blue hover:underline flex items-center gap-1">
                            Gestionar todo <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Contract List */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        {contracts.length === 0 ? (
                            <div className="text-center py-20 px-6">
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Plus className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-slate-800 font-bold text-lg mb-2">Comienza ahora</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                                    Crea tu primer contrato digital. Es gratuito, seguro y te permite recibir valoraciones reales.
                                </p>
                                <Link href="/dashboard/contracts/new">
                                    <Button size="lg" className="rounded-full px-8 bg-brand-blue hover:bg-slate-800">
                                        Crear Primer Contrato
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {contracts.map(contract => (
                                    <Link href={`/dashboard/contracts/${contract.id}`} key={contract.id} className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-lg group-hover:text-brand-blue transition-colors">{contract.propertyAddress}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 rounded-md",
                                                        contract.status === 'VERIFIED' ? "bg-green-50 text-green-700 border-green-200" :
                                                            contract.status === 'PENDING' ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-slate-100 text-slate-600")}>
                                                        {contract.status === 'VERIFIED' ? 'Verificado' : contract.status === 'PENDING' ? 'Pendiente' : contract.status}
                                                    </Badge>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Users className="w-3 h-3" /> {contract.tenantEmail}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-semibold text-slate-700">Contrato</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Insights Box */}
                    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-indigo-900">
                            <TrendingUp className="w-5 h-5" />
                            <h3 className="font-bold">Rentabilidad</h3>
                        </div>
                        <p className="text-sm text-indigo-800/80 leading-relaxed mb-4">
                            Los propietarios con perfil verificado alquilan un <strong>30% más rápido</strong>.
                        </p>
                        <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[70%]"></div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Tu progreso</h3>
                        <div className="space-y-4">
                            <ProgressItem label="Perfil Completado" done={hasProfile} />
                            <ProgressItem label="Primer Contrato" done={hasContract} />
                            <ProgressItem label="Reviews Recibidas" done={hasReview} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProgressItem({ label, done }: { label: string, done: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors", done ? "bg-brand-green text-white" : "bg-slate-100 text-slate-300")}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 dashed" />}
            </div>
            <span className={cn("text-sm font-medium", done ? "text-slate-800" : "text-slate-400")}>{label}</span>
        </div>
    );
}
