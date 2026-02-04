"use client";

import { useData } from "@/contexts/data-context";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Star, Plus, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContractsPage() {
    const { user } = useAuth();
    const { getContractsByTenant, getContractsByLandlord, reviews } = useData();
    const [allowRequests, setAllowRequests] = useState(false);

    if (!user) return null;

    const contracts = user.role === "TENANT"
        ? getContractsByTenant(user.email)
        : getContractsByLandlord(user.email);

    // Sort contracts: VERIFIED/ACTIVE first, then PENDING, then ENDED (sorted by creation date)
    const sortedContracts = [...contracts].sort((a, b) => {
        const statusPriority = {
            "VERIFIED": 0,
            "ACTIVE": 0,
            "PENDING": 1,
            "ENDED": 2
        };

        const priorityA = statusPriority[a.status as keyof typeof statusPriority] ?? 3;
        const priorityB = statusPriority[b.status as keyof typeof statusPriority] ?? 3;

        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        // If same priority, sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="space-y-4 md:space-y-6 w-full max-w-full overflow-x-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-brand-blue">Contratos</h1>
                    <p className="text-neutral-500">Historial completo de tus alquileres.</p>
                </div>
                {user.role === "LANDLORD" && (
                    <Link href="/dashboard/contracts/new">
                        <Button className="bg-brand-green hover:bg-brand-green/90 text-white shadow-lg shadow-brand-green/20">
                            <Plus className="w-5 h-5 mr-2" /> Nuevo Contrato
                        </Button>
                    </Link>
                )}
            </div>

            <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                    <CardTitle>Todos los contratos ({contracts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {sortedContracts.length === 0 ? (
                        <div className="text-center py-16 text-neutral-500 bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="font-medium text-lg text-neutral-700">No hay contratos</p>
                            <p className="text-sm">No se han encontrado contratos asociados a tu cuenta.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedContracts.map((contract) => (
                                <div key={contract.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-lg border border-neutral-100 bg-white hover:border-brand-blue/20 hover:shadow-md transition-all gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-brand-blue shrink-0">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className={
                                                    contract.status === "VERIFIED" || contract.status === "ACTIVE" ? "bg-blue-50 text-brand-blue border-blue-200" :
                                                        contract.status === "ENDED" ? "bg-neutral-100 text-neutral-600 border-neutral-200" :
                                                            contract.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                                                "text-neutral-500"
                                                }>
                                                    {contract.status === "VERIFIED" || contract.status === "ACTIVE" ? "En Curso" :
                                                        contract.status === "ENDED" ? "Finalizado" :
                                                            contract.status === "PENDING" ? "Pendiente" : contract.status}
                                                </Badge>
                                                <span className="text-xs text-neutral-400 shrink-0">ID: {contract.id.slice(0, 8)}</span>
                                            </div>
                                            <h3 className="font-semibold text-lg text-brand-blue group-hover:text-brand-green transition-colors truncate">{contract.propertyAddress}</h3>

                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-neutral-500">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {contract.propertyAddress}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {contract.startDate} - {contract.endDate}
                                                </div>
                                            </div>
                                            <div className="mt-1 text-sm text-neutral-500">
                                                {user.role === "TENANT" ?
                                                    <>Propietario: <span className="text-neutral-700 font-medium">{contract.landlordId}</span></> :
                                                    <>Inquilino: <span className="text-neutral-700 font-medium">{contract.tenantEmail}</span></>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 md:self-center self-end">
                                        <div className="flex gap-2">
                                            {/* 6 Month Badge */}
                                            {reviews.some(r => r.contractId === contract.id && r.reviewerId === user.email && r.period === "6_MONTHS") ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> 6 Meses
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-neutral-400 border-neutral-200 border-dashed">
                                                    6 Meses
                                                </Badge>
                                            )}

                                            {/* Final Badge */}
                                            {reviews.some(r => r.contractId === contract.id && r.reviewerId === user.email && r.period === "END_OF_CONTRACT") ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Final
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-neutral-400 border-neutral-200 border-dashed">
                                                    Final
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {(contract.status === "VERIFIED" || contract.status === "ACTIVE") ? (
                                                <Link href={`/dashboard/contracts/${contract.id}/review`}>
                                                    <Button variant="default" className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                                                        <Star className="w-4 h-4 mr-2" /> Valorar
                                                    </Button>
                                                </Link>
                                            ) : contract.status === "ENDED" ? (
                                                <Link href={`/dashboard/contracts/${contract.id}/review`}>
                                                    <Button variant="secondary" className="bg-brand-green/20 text-brand-green hover:bg-brand-green/30">
                                                        <Star className="w-4 h-4 mr-2" /> Valorar Final
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button disabled variant="secondary" className="bg-neutral-100 text-neutral-400 cursor-not-allowed" title="Requiere verificación por Admin">
                                                    <Star className="w-4 h-4 mr-2" /> Valorar
                                                </Button>
                                            )}
                                            <Link href={`/dashboard/contracts/${contract.id}`}>
                                                <Button variant="outline" className="text-neutral-600 hover:text-brand-blue hover:border-brand-blue">Ver detalles</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
