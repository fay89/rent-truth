"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useData } from "@/contexts/data-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, FileText, MapPin, User, Download, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ContractDetailsPage() {
    const params = useParams();
    const { getPublicUser } = useAuth();
    const { contracts, reviews } = useData();
    const contract = contracts.find(c => c.id === params.id) || null;
    const [landlordName, setLandlordName] = useState<string>("Cargando...");
    const [tenantName, setTenantName] = useState<string>("Cargando...");

    useEffect(() => {
        if (contract) {
            // Fetch User Names
            getPublicUser(contract.landlordId).then(u => {
                setLandlordName(u?.name || contract.landlordId);
            });

            getPublicUser(contract.tenantEmail).then(u => {
                setTenantName(u?.name || "Usuario no registrado");
            });
        }
    }, [contract, getPublicUser]);

    if (!contract) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
                <p className="text-neutral-500">Cargando detalles del contrato...</p>
            </div>
        );
    }

    // Calculate Duration logic
    const start = new Date(contract.startDate);
    const end = new Date(contract.endDate);

    // Check for valid dates
    let durationString = "Fechas no válidas";
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30.44); // Average month length

        if (diffMonths >= 12) {
            const years = Math.floor(diffMonths / 12);
            const remainingMonths = diffMonths % 12;
            durationString = `${years} año${years > 1 ? 's' : ''} ${remainingMonths > 0 ? `y ${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}` : ''}`;
        } else if (diffMonths > 0) {
            durationString = `${diffMonths} mes${diffMonths > 1 ? 'es' : ''}`;
            if (diffDays % 30 > 5) {
                durationString += ` y ${(diffDays % 30)} días`
            }
        } else {
        }
    }

    const handleDownload = async () => {
        if (!contract?.contractUrl) return;

        try {
            const { data, error } = await supabase.storage
                .from('contracts')
                .createSignedUrl(contract.contractUrl, 60); // Valid for 60 seconds

            if (error) {
                console.error("Error signing URL:", error);
                alert("Error al descargar: " + error.message);
                return;
            }

            if (data?.signedUrl) {
                window.open(data.signedUrl, '_blank');
            }
        } catch (err) {
            console.error(err);
            alert("Error desconocido al descargar.");
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <Link href="/dashboard/contracts" className="text-neutral-400 hover:text-brand-blue transition-colors p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-bold text-brand-blue">Detalles del Contrato</h1>
                        <Badge variant="outline" className={
                            contract.status === "VERIFIED" ? "bg-green-50 text-green-700 border-green-200" :
                                contract.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""
                        }>
                            {contract.status === "VERIFIED" ? "Verificado" : contract.status === "PENDING" ? "Pendiente" : contract.status}
                        </Badge>
                    </div>
                    <p className="text-neutral-500 text-sm mt-1">ID Ref: {contract.id}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-start">
                {/* Left Column (2/3) */}
                <div className="md:col-span-2 space-y-6">
                    {/* Main Info */}
                    <Card className="border-none shadow-md bg-white overflow-hidden">
                        <div className="h-1 bg-brand-blue w-full" />
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-brand-blue" /> Propiedad y Condiciones
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-4 p-4 bg-neutral-50/80 border border-neutral-100 rounded-xl">
                                <div className="bg-white p-2.5 rounded-lg shadow-sm">
                                    <MapPin className="w-5 h-5 text-brand-blue" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Dirección del Inmueble</p>
                                    <p className="text-lg font-medium text-brand-blue">{contract.propertyAddress}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-neutral-50/80 border border-neutral-100 rounded-xl">
                                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Fecha Inicio</p>
                                    <div className="flex items-center gap-2 font-semibold text-neutral-700">
                                        <Calendar className="w-4 h-4 text-brand-blue" /> {contract.startDate}
                                    </div>
                                </div>
                                <div className="p-4 bg-neutral-50/80 border border-neutral-100 rounded-xl">
                                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Fecha Fin</p>
                                    <div className="flex items-center gap-2 font-semibold text-neutral-700">
                                        <Calendar className="w-4 h-4 text-brand-blue" /> {contract.endDate}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-5 border border-blue-100 bg-blue-50/30 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="bg-brand-blue/10 p-2 rounded-full">
                                        <ClockIcon className="w-5 h-5 text-brand-blue" />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-neutral-500 font-medium uppercase">Duración calculada</span>
                                        <span className="font-bold text-xl text-brand-blue">{durationString}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contract Rating Section */}
                    <Card className="border-none shadow-md bg-white overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-brand-blue" /> Valoraciones de este Contrato
                            </CardTitle>
                            <CardDescription>Reseñas exclusivas de este alquiler.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {reviews.filter(r => r.contractId === contract.id).length === 0 ? (
                                <div className="text-center py-6 bg-neutral-50 rounded-lg border border-neutral-100">
                                    <p className="text-sm text-neutral-500">Aún no hay valoraciones para este contrato.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.filter(r => r.contractId === contract.id).map((r, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 border border-neutral-100 rounded-lg bg-white">
                                            <div className={`p-2 rounded-full ${r.reviewerId === contract.landlordId ? 'bg-blue-50 text-brand-blue' : 'bg-green-50 text-green-700'}`}>
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-sm text-neutral-800">
                                                            {r.reviewerId === contract.landlordId ? "Propietario" : "Inquilino"} ({r.period === "6_MONTHS" ? "6 Meses" : "Final"})
                                                        </p>
                                                        <p className="text-xs text-neutral-400">Escrito por: {r.reviewerId}</p>
                                                    </div>
                                                    <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-100">
                                                        ★ {r.rating}/5
                                                    </Badge>
                                                </div>
                                                {r.comment && (
                                                    <p className="text-sm text-neutral-600 mt-2 bg-neutral-50 p-2 rounded block">
                                                        &quot;{r.comment}&quot;
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div> {/* End Left Column */}

                {/* Right Column (1/3) - Sidebar */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md bg-white">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="w-4 h-4" /> Partes Involucradas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-neutral-100 p-2 rounded-full">
                                    <User className="w-4 h-4 text-neutral-500" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">Propietario</p>
                                    <p className="font-medium text-sm text-neutral-700 truncate">{landlordName}</p>
                                    <p className="text-xs text-neutral-400 truncate" title={contract.landlordId}>{contract.landlordId}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="bg-neutral-100 p-2 rounded-full">
                                    <User className="w-4 h-4 text-neutral-500" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">Inquilino</p>
                                    <p className="font-medium text-sm text-neutral-700 truncate">{tenantName}</p>
                                    <p className="text-xs text-neutral-400 truncate" title={contract.tenantEmail}>{contract.tenantEmail}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Documentación
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-lg p-5 flex flex-col items-center text-center gap-3 transition-colors hover:bg-neutral-100/50">
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <FileText className="w-6 h-6 text-brand-blue" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-700">Contrato Firmado</p>
                                    <p className="text-xs text-neutral-400 mt-0.5">
                                        {contract.contractUrl ? "Disponible para descarga" : "No adjuntado"}
                                    </p>
                                </div>

                                <Button
                                    onClick={handleDownload}
                                    disabled={!contract.contractUrl}
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-1 gap-2 border-brand-blue/30 text-brand-blue hover:text-brand-blue"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Descargar</span>
                                </Button>

                                {!contract.contractUrl && (
                                    <p className="text-[10px] text-neutral-400 leading-tight">
                                        El propietario no adjuntó archivo al crear el contrato.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
