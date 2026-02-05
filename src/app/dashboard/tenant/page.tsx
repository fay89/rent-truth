"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/data-context";
import { useMarketStats } from "@/hooks/use-market-stats";

import { ShareReputationDialog } from "@/components/share-reputation-dialog";
import { CheckCircle2, Circle, Clock, FileText, Bell, Shield, ChevronRight, Star, ArrowUpRight, ShieldCheck, QrCode, Zap, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TenantDashboard() {
    const { getContractsByTenant, signContract, reviews } = useData();
    const { user } = useAuth();
    const stats = useMarketStats();
    const [isPublic, setIsPublic] = useState(true);

    if (!user) return null;

    const contracts = getContractsByTenant(user.email);
    const pendingContracts = contracts.filter(c => c.status === "PENDING");

    // Metrics
    const myReviews = reviews.filter(r => r.targetId === user.email);
    const rating = myReviews.length > 0
        ? (myReviews.reduce((acc, r) => acc + r.rating, 0) / myReviews.length).toFixed(1)
        : "N/A";

    const hasProfile = user.identityVerified;
    const hasContract = contracts.length > 0;
    const hasReview = myReviews.length > 0;

    const handleVerify = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm("¿Confirmas que has leído y aceptas el contrato?")) {
            await signContract(id);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Hero / Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Reputation Score - Hero Card */}
                <div className="md:col-span-1 bg-gradient-to-br from-brand-blue to-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-brand-blue/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/20 shrink-0 shadow-lg">
                                    {user.photoUrl ? (
                                        <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-white text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-blue-200 mb-1">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold tracking-wide text-sm uppercase">Reputación</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-extrabold tracking-tighter">{rating}</span>
                                <span className="text-xl text-blue-200/50">/ 5.0</span>
                            </div>
                            <p className="text-sm text-blue-200 mt-1">{myReviews.length} reseñas verificadas</p>
                        </div>
                        <div className="mt-8">
                            <ShareReputationDialog
                                trigger={
                                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm border border-white/10 shadow-lg shadow-black/10 transition-all group-hover:scale-[1.02]">
                                        <div className="flex items-center gap-2">
                                            <QrCode className="w-4 h-4" />
                                            <span>Compartir mi QR</span>
                                        </div>
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Status */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Verification Status */}
                    <div className={cn("p-6 rounded-3xl border transition-all h-full flex flex-col justify-between", hasProfile ? "bg-white border-slate-100 shadow-sm" : "bg-red-50 border-red-100")}>
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-2.5 rounded-xl", hasProfile ? "bg-brand-green/10 text-brand-green" : "bg-red-100 text-red-500")}>
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                {!hasProfile && <Badge variant="destructive" className="rounded-full">Acción requerida</Badge>}
                            </div>
                            <h3 className="font-bold text-lg text-slate-800">Identidad {hasProfile ? "Verificada" : "Pendiente"}</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                {hasProfile ? "Tu perfil genera máxima confianza a los propietarios." : "Verifica tu DNI y Selfie para poder firmar contratos."}
                            </p>
                        </div>
                        {!hasProfile && (
                            <Link href="/dashboard/verification" className="mt-4 inline-block">
                                <Button size="sm" variant="destructive" className="w-full rounded-xl">Verificar Ahora</Button>
                            </Link>
                        )}
                    </div>

                    {/* Pending Contracts Alert */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-blue-50 text-brand-blue p-2.5 rounded-xl">
                                    <FileText className="w-6 h-6" />
                                </div>
                                {pendingContracts.length > 0 && <Badge className="bg-orange-500 hover:bg-orange-600 rounded-full">{pendingContracts.length} Pendientes</Badge>}
                            </div>
                            <h3 className="font-bold text-lg text-slate-800">Contratos</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                Tienes {contracts.length} contratos en total. {pendingContracts.length > 0 ? "Revisa los pendientes para evitar retrasos." : "Todo está al día."}
                            </p>
                        </div>
                        <Button variant="outline" className="mt-4 w-full rounded-xl border-slate-200 text-slate-600 hover:text-brand-blue hover:bg-slate-50" asChild>
                            <Link href="/dashboard/contracts">Gestión de Contratos</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* RentTruth Advantage - Market Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-brand-blue/5 border border-brand-blue/10 p-5 rounded-2xl flex items-start gap-4 hover:bg-brand-blue/10 transition-colors">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm text-brand-blue shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Confianza Total</h4>
                        <p className="text-sm text-slate-600 leading-snug">
                            El <span className="font-bold text-brand-blue">{stats.landlordPreference}% de los propietarios</span> priorizan candidatos con identidad verificada.
                        </p>
                    </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-start gap-4 hover:bg-emerald-100/50 transition-colors">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm text-emerald-600 shrink-0">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Ultra Rápido</h4>
                        <p className="text-sm text-slate-600 leading-snug">
                            Consigue alquiler <span className="font-bold text-emerald-600">{stats.rentalSpeed}x más rápido</span> al presentar tu historial validado.
                        </p>
                    </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex items-start gap-4 hover:bg-indigo-100/50 transition-colors">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm text-indigo-600 shrink-0">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">+{stats.activeTenants.toLocaleString()} Inquilinos</h4>
                        <p className="text-sm text-slate-600 leading-snug">
                            Únete a la comunidad que está transformando el alquiler en una experiencia <span className="font-bold text-indigo-600">segura y justa</span>.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Sections Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Actividad Reciente</h2>
                        <Link href="/dashboard/contracts" className="text-sm font-semibold text-brand-blue hover:underline flex items-center gap-1">
                            Ver todo <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Pending Contracts Detailed List */}
                    {pendingContracts.length > 0 && (
                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -z-10"></div>
                            <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5" /> Requiere tu firma
                            </h3>
                            <div className="space-y-3">
                                {pendingContracts.map(contract => (
                                    <div key={contract.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-orange-200/50 flex flex-col sm:flex-row justify-between items-center gap-4 transition-transform hover:scale-[1.01]">
                                        <div>
                                            <p className="font-bold text-slate-800">{contract.propertyAddress}</p>
                                            <p className="text-xs text-slate-500">Propietario: {contract.landlordId}</p>
                                        </div>
                                        <Button onClick={(e) => handleVerify(contract.id, e)} className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-lg shadow-orange-500/20">
                                            Revisar y Firmar
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Latest Contracts */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        {contracts.length === 0 ? (
                            <div className="text-center py-16 px-6">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-slate-800 font-bold mb-2">Aún no tienes contratos</h3>
                                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                                    Pide a tu propietario que cree el contrato en RentTruth para empezar a generar historial.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {contracts.slice(0, 5).map((contract) => (
                                    <Link href={`/dashboard/contracts/${contract.id}`} key={contract.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 group-hover:text-brand-blue transition-colors">{contract.propertyAddress}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5",
                                                        contract.status === 'VERIFIED' ? "bg-green-50 text-green-700 border-green-200" :
                                                            contract.status === 'PENDING' ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-slate-100 text-slate-600")}>
                                                        {contract.status === 'VERIFIED' ? 'Verificado' : contract.status}
                                                    </Badge>
                                                    <span className="text-xs text-slate-400">{contract.startDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-blue transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Onboarding Box */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Tu progreso</h3>
                        <div className="space-y-4">
                            <ProgressItem label="Perfil Completado" done={hasProfile} />
                            <ProgressItem label="Contrato Verificado" done={hasContract} />
                            <ProgressItem label="Primera Reseña" done={hasReview} />
                        </div>
                    </div>

                    {/* Quick Toggle */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-700">Perfil Público</span>
                            <div
                                onClick={() => setIsPublic(!isPublic)}
                                className={cn("h-6 w-11 rounded-full relative cursor-pointer transition-colors duration-300", isPublic ? "bg-brand-green" : "bg-slate-300")}
                            >
                                <div className={cn("absolute top-1 h-4 w-4 bg-white rounded-full transition-transform duration-300 shadow-sm", isPublic ? "translate-x-6" : "translate-x-1")} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">
                            {isPublic ? "Tu perfil es visible para propietarios verificados." : "Solo tú puedes ver tu perfil."}
                        </p>
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
