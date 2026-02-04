"use client";

import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, ArrowRight, ShieldAlert, CheckCircle2, ShieldCheck, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboardPage() {
    const { contracts, users } = useData();
    const router = useRouter();

    const pendingContracts = contracts.filter(c => c.status === "PENDING_ADMIN");
    const verifiedContracts = contracts.filter(c => c.status === "VERIFIED");

    // Stats
    const totalUsers = users.length;
    const pendingVerifications = pendingContracts.length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1 bg-red-600 rounded-2xl p-6 text-white shadow-lg shadow-red-900/20 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 bg-white/10 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <p className="text-red-100 text-sm font-medium mb-1 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> Pendientes
                        </p>
                        <p className="text-4xl font-bold tracking-tight">{pendingVerifications}</p>
                        <p className="text-xs text-red-200 mt-2">Requieren tu atención inmediata</p>
                    </div>
                </div>

                <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Verificados
                    </p>
                    <p className="text-3xl font-bold text-slate-800">{verifiedContracts.length}</p>
                    <p className="text-xs text-slate-400 mt-2">Contratos activos y seguros</p>
                </div>

                <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" /> Total Contratos
                    </p>
                    <p className="text-3xl font-bold text-slate-800">{contracts.length}</p>
                    <p className="text-xs text-slate-400 mt-2">Histórico de la plataforma</p>
                </div>

                <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-500" /> Usuarios
                    </p>
                    <p className="text-3xl font-bold text-slate-800">{totalUsers}</p>
                    <p className="text-xs text-slate-400 mt-2">Registrados en total</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Cola de Verificación</h2>
                        <p className="text-slate-500">Revisa la documentación y aprueba los contratos pendientes.</p>
                    </div>
                    {pendingContracts.length > 0 && (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 px-3 py-1">
                            {pendingContracts.length} Pendientes
                        </Badge>
                    )}
                </div>

                {pendingContracts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 text-center">
                        <div className="bg-green-50 p-4 rounded-full mb-4">
                            <ShieldCheck className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Todo limpio</h3>
                        <p className="text-slate-500 max-w-sm mt-1">
                            No hay contratos pendientes de verificación. Relax time! ☕
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {pendingContracts.map((contract) => (
                            <Card key={contract.id} className="group hover:shadow-lg hover:shadow-red-900/5 transition-all border-l-4 border-l-red-500 overflow-hidden relative">
                                <CardHeader className="pb-3 bg-red-50/30">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0">
                                            Revisión Manual
                                        </Badge>
                                        <span className="text-xs text-slate-400 font-mono font-medium">
                                            {new Date(contract.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-1 font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                                        {contract.propertyAddress}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4 text-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-xs text-slate-400 uppercase font-semibold">Propietario</span>
                                            <div className="flex items-center gap-2 text-slate-700 font-medium truncate">
                                                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                                <span className="truncate" title={contract.landlordId}>{contract.landlordId}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-slate-400 uppercase font-semibold">Inquilino</span>
                                            <div className="flex items-center gap-2 text-slate-700 font-medium truncate">
                                                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                                <span className="truncate" title={contract.tenantEmail}>{contract.tenantEmail}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            <span className="text-xs font-semibold">{contract.startDate}</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold">{contract.endDate}</span>
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2 bg-slate-50/50">
                                    <Button
                                        className="w-full bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold transition-all"
                                        onClick={() => router.push(`/dashboard/admin/verify/${contract.id}`)}
                                    >
                                        Auditar Contrato
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
