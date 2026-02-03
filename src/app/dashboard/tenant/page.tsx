"use client";

import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { Badge } from "@/components/ui/badge";
import { ShareReputationDialog } from "@/components/share-reputation-dialog";
import { CheckCircle2, Circle, Clock, FileText, Bell, Shield, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

export default function TenantDashboard() {
    const { getContractsByTenant, signContract, reviews } = useData();
    const { user } = useAuth();

    // Privacy State
    const [isPublic, setIsPublic] = useState(true);
    const [allowRequests, setAllowRequests] = useState(false);

    const contracts = user ? getContractsByTenant(user.email) : [];
    const activeContracts = contracts.filter(c => c.status === "ACTIVE" || c.status === "VERIFIED"); // Used in summary?
    const pendingContracts = contracts.filter(c => c.status === "PENDING");

    // Logic for checklist
    const hasProfile = user?.identityVerified;
    const hasContract = contracts.length > 0;
    const hasReview = reviews.some(r => r.targetId === user?.email);

    const isPrivacyConfigured = !isPublic || allowRequests; // Considering "configured" if changed from default? Or just check if state exists. Let's keep checklist simple.

    e.preventDefault();
    if (confirm("¿Confirmas que aceptas este contrato y sus condiciones?")) {
        verifyContract(id);
    }
};

return (
    <div className="space-y-5 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full overflow-x-hidden">
        {/* Header / Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 w-full max-w-full">
            <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-blue flex items-center gap-2 truncate">
                    Hola, {user.name} <span className="text-xl md:text-2xl">👋</span>
                </h1>
                <p className="text-sm md:text-base text-neutral-500 truncate">Bienvenido a tu panel de control.</p>
            </div>

            <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
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
                <ShareReputationDialog />
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 w-full max-w-full">
            {/* Main Column (Left - 2/3) */}
            <div className="lg:col-span-2 space-y-8 min-w-0 w-full">

                {/* Onboarding Checklist */}
                <Card className="border-none shadow-sm bg-white w-full max-w-full overflow-hidden">
                    <CardHeader className="break-words">
                        <CardTitle className="text-xl">Checklist de onboarding</CardTitle>
                        <CardDescription>Completa estos pasos para sacar el máximo partido a RentTruth.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <CheckItem
                            completed={hasProfile}
                            title="Completa tu perfil"
                            description="Añade tu información básica para generar confianza."
                        />
                        <CheckItem
                            completed={hasContract}
                            title="Sube o verifica un contrato"
                            description="El primer paso para construir tu reputación."
                        />
                        <CheckItem
                            completed={hasReview}
                            title="Solicita/deja una review"
                            description="Las valoraciones verificadas son tu mejor carta de presentación."
                        />
                        <CheckItem
                            completed={isPrivacyConfigured}
                            title="Configura tu privacidad"
                            description="Decide quién puede ver tu perfil y contratos."
                        />
                    </CardContent>
                </Card>

                {/* Pending Actions / Verification */}
                {pendingContracts.length > 0 && (
                    <Card className="border-l-4 border-l-yellow-500 shadow-sm bg-yellow-50/50 w-full max-w-full overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-yellow-700 flex items-center gap-2">
                                <Clock className="w-5 h-5 shrink-0" /> Acciones Pendientes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {pendingContracts.map(contract => (
                                <div key={contract.id} className="bg-white p-4 rounded-lg border border-yellow-100 flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
                                    <div className="min-w-0 w-full">
                                        <p className="font-medium text-brand-blue truncate">Contrato pendiente de firma</p>
                                        <p className="text-sm text-neutral-500 truncate">{contract.propertyAddress}</p>
                                        <p className="text-xs text-neutral-400 truncate">Propietario: {contract.landlordId}</p>
                                    </div>
                                    <Button
                                        onClick={(e) => handleVerify(contract.id, e)}
                                        className="bg-brand-green hover:bg-brand-green/90 text-white w-full sm:w-auto shrink-0"
                                    >
                                        Verificar y Aceptar
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Active Contracts Summary */}
                <Card className="border-none shadow-sm w-full max-w-full overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div className="min-w-0">
                            <CardTitle className="truncate">Mis Contratos</CardTitle>
                            <CardDescription className="truncate">Tus alquileres activos e históricos.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild className="shrink-0">
                            <Link href="/dashboard/contracts">Ver todos</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {contracts.length === 0 ? (
                            <div className="text-center py-8 text-neutral-500 bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
                                <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p>No tienes contratos registrados.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 w-full">
                                {contracts.slice(0, 3).map((contract) => (
                                    <div key={contract.id} className="group flex items-center justify-between p-4 rounded-lg border border-neutral-100 bg-white hover:border-brand-blue/20 hover:shadow-md transition-all w-full gap-4">
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shrink-0">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-brand-blue group-hover:text-brand-green transition-colors truncate">{contract.propertyAddress}</p>
                                                <p className="text-xs text-neutral-500 truncate">{contract.startDate} - {contract.endDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Badge variant="outline" className={
                                                contract.status === "VERIFIED" ? "bg-green-50 text-green-700 border-green-200" :
                                                    contract.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""
                                            }>
                                                {contract.status === "VERIFIED" ? "Verificado" : contract.status}
                                            </Badge>
                                            <Link href={`/dashboard/contracts/${contract.id}`}>
                                                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-brand-blue">
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Sube tu contrato Promo */}
                {!hasContract && (
                    <div className="bg-brand-blue text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg w-full max-w-full">
                        <div className="min-w-0">
                            <h3 className="text-xl font-bold mb-2 truncate">Sube tu primer contrato</h3>
                            <p className="text-blue-100 text-sm max-w-md break-words">Empieza a generar tu historial de reputación verificada. Es gratuito y seguro.</p>
                        </div>
                        <Button className="bg-white text-brand-blue hover:bg-blue-50 whitespace-nowrap shrink-0">
                            Crear contrato
                        </Button>
                    </div>
                )}

            </div>

            {/* Sidebar Column (Right - 1/3) */}
            <div className="space-y-8 min-w-0 w-full">
                {/* Notifications (Mocked) */}
                <Card className="border-none shadow-sm w-full max-w-full overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Bell className="w-4 h-4" /> Notificaciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-3 items-start w-full">
                            <div className="h-2 w-2 mt-2 rounded-full bg-red-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">Bienvenido a RentTruth</p>
                                <p className="text-xs text-neutral-500 mt-1">Hace 2 horas</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start opacity-60 w-full">
                            <div className="h-2 w-2 mt-2 rounded-full bg-neutral-300 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">Completa tu perfil para ser verificado</p>
                                <p className="text-xs text-neutral-500 mt-1">Hace 1 día</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tips / Consejos */}
                <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white w-full max-w-full overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Consejos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="bg-white p-3 rounded-md border border-blue-100 shadow-sm">
                            <p className="text-sm text-brand-blue font-medium mb-1">Verificación de identidad</p>
                            <p className="text-xs text-neutral-500 break-words">Los perfiles verificados tienen un 80% más de probabilidad de ser aceptados.</p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-blue-100 shadow-sm">
                            <p className="text-sm text-brand-blue font-medium mb-1">Pago puntual</p>
                            <p className="text-xs text-neutral-500 break-words">Paga tu alquiler antes del día 5 para mantener un score perfecto.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy Quick Settings */}
                <Card className="border-none shadow-sm w-full max-w-full overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg">Privacidad rápida</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-600">Perfil público</span>
                            <div
                                onClick={() => setIsPublic(!isPublic)}
                                className={`h-6 w-11 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out ${isPublic ? "bg-brand-green" : "bg-neutral-200"}`}
                            >
                                <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${isPublic ? "translate-x-6" : "translate-x-1"}`} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-600">Permitir solicitudes</span>
                            <div
                                onClick={() => setAllowRequests(!allowRequests)}
                                className={`h-6 w-11 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out ${allowRequests ? "bg-brand-green" : "bg-neutral-200"}`}
                            >
                                <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${allowRequests ? "translate-x-6" : "translate-x-1"}`} />
                            </div>
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
