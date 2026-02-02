"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, FileText, Shield, ArrowRight, Plus, Star } from "lucide-react";
import Link from "next/link";
import { ShareReputationDialog } from "@/components/share-reputation-dialog";

export default function LandlordDashboard() {
    const { user } = useAuth();
    const { getContractsByLandlord, reviews } = useData();

    if (!user) return null;

    const contracts = getContractsByLandlord(user.email);
    const pendingContracts = contracts.filter(c => c.status === "PENDING" || c.status === "VERIFIED");
    const activeContractsData = contracts.filter(c => c.status === "ACTIVE" || c.status === "ENDED");

    // Logic for checklist (Landlord)
    const hasProfile = user.identityVerified;
    const hasCreatedContract = contracts.length > 0;
    const hasReview = reviews.some(r => r.targetId === user.email);

    return (
        <div className="space-y-5 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 w-full max-w-full">
                <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-brand-blue flex items-center gap-2 truncate">
                        Hola, {user.name} <span className="text-xl md:text-2xl">👋</span>
                    </h1>
                    <p className="text-sm md:text-base text-neutral-500 truncate">Gestiona tus propiedades y contratos.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    {/* Visual Rating Badge */}
                    <div className="flex items-center gap-3 bg-white p-2 pr-5 rounded-2xl border border-yellow-100 shadow-sm max-w-full overflow-hidden shrink-0">
                        <div className="bg-yellow-50 p-2.5 rounded-xl shrink-0">
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-brand-blue leading-none">
                                    {reviews.filter(r => r.targetId === user.email).length > 0
                                        ? (reviews.filter(r => r.targetId === user.email).reduce((acc, r) => acc + r.rating, 0) / reviews.filter(r => r.targetId === user.email).length).toFixed(1)
                                        : "N/A"}
                                </span>
                                <span className="text-xs text-neutral-400 font-medium">/ 5.0</span>
                            </div>
                            <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider truncate">
                                {reviews.filter(r => r.targetId === user.email).length} Reseñas
                            </span>
                        </div>
                    </div>

                    {/* Primary CTA */}
                    <div className="flex gap-2 shrink-0">
                        <ShareReputationDialog />
                        <Link href="/dashboard/contracts/new">
                            <Button className="h-14 px-6 bg-brand-green hover:bg-brand-green/90 text-white shadow-lg shadow-brand-green/20 rounded-xl text-base font-semibold">
                                <Plus className="w-5 h-5 mr-2" /> Nuevo Contrato
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 w-full max-w-full">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-8 min-w-0 w-full">

                    {/* Onboarding Checklist */}
                    <Card className="border-none shadow-sm bg-white w-full max-w-full overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-xl">Tu checklist de propietario</CardTitle>
                            <CardDescription>Pasos para blindar tus alquileres.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CheckItem
                                completed={hasProfile}
                                title="Verifica tu identidad"
                                description="Genera confianza a tus futuros inquilinos."
                            />
                            <CheckItem
                                completed={hasCreatedContract}
                                title="Crea tu primer contrato"
                                description="Los inquilinos verificados solo pueden opinar con contrato."
                            />
                            <CheckItem
                                completed={hasReview}
                                title="Recibe valoraciones"
                                description="Acumula reviews positivas para destacar tu perfil."
                            />
                        </CardContent>
                    </Card>

                    {/* Active Contracts Summary */}
                    <Card className="border-none shadow-sm w-full max-w-full overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between gap-4">
                            <div className="min-w-0">
                                <CardTitle className="truncate">Mis Propiedades/Contratos</CardTitle>
                                <CardDescription className="truncate">Resumen de tus alquileres actuales.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild className="shrink-0">
                                <Link href="/dashboard/contracts">Ver todos</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {contracts.length === 0 ? (
                                <div className="text-center py-12 text-neutral-500 bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
                                    <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Plus className="w-6 h-6 text-brand-blue" />
                                    </div>
                                    <p className="font-medium text-brand-blue mb-1">No tienes contratos activos</p>
                                    <p className="text-sm mb-4">Crea un contrato para empezar a recibir reviews.</p>
                                    <Link href="/dashboard/contracts/new">
                                        <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-blue-50">
                                            Crear contrato
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4 w-full">
                                    {contracts.slice(0, 3).map((contract) => (
                                        <Link href={`/dashboard/contracts/${contract.id}`} key={contract.id} className="block group w-full">
                                            <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-100 bg-white hover:border-brand-blue/30 hover:shadow-sm transition-all cursor-pointer w-full gap-4">
                                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors shrink-0">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-brand-blue truncate">{contract.propertyAddress}</p>
                                                        <p className="text-xs text-neutral-500 truncate">Inquilino: {contract.tenantEmail}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Badge variant="outline" className={
                                                        contract.status === "VERIFIED" ? "bg-green-50 text-green-700 border-green-200" :
                                                            contract.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""
                                                    }>
                                                        {contract.status === "VERIFIED" ? "Verificado" : contract.status === "PENDING" ? "Pendiente" : contract.status}
                                                    </Badge>
                                                    <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8 min-w-0 w-full">
                    <Card className="border-none shadow-sm bg-brand-blue text-white w-full max-w-full overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" /> Protección RentTruth
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-blue-100 break-words">
                                Tus contratos están protegidos y verificados. Solo los inquilinos con contrato real pueden dejarte reseñas.
                            </p>
                            <div className="text-xs bg-white/10 p-3 rounded text-blue-50">
                                0% Reseñas falsas garantizado
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm w-full max-w-full overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg">Consejos para propietarios</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="bg-white p-3 rounded-md border border-neutral-100">
                                <p className="text-sm text-brand-blue font-medium mb-1">Fotos verificadas</p>
                                <p className="text-xs text-neutral-500 break-words">Sube fotos del estado inicial del piso para evitar disputas.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function CheckItem({ completed, title, description }: { completed: boolean; title: string; description: string }) {
    return (
        <div className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${completed ? "bg-green-50/50 border-green-100" : "bg-white border-neutral-100"}`}>
            <div className="pt-0.5">
                {completed ? (
                    <CheckCircle2 className="w-6 h-6 text-brand-green" />
                ) : (
                    <Circle className="w-6 h-6 text-neutral-300" />
                )}
            </div>
            <div>
                <h4 className={`font-semibold ${completed ? "text-brand-green" : "text-neutral-700"}`}>{title}</h4>
                <p className="text-sm text-neutral-500 mt-1">{description}</p>
            </div>
            {/* {!completed && (
                <div className="ml-auto">
                    <Button variant="ghost" size="sm" className="text-brand-blue hover:text-brand-blue/80 font-medium">
                        Completar
                    </Button>
                </div>
            )} */}
        </div>
    );
}
